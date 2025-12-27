import cloudinary from "../configs/cloudinary.js";
import main from "../configs/gemini.js";
import Blog from "../models/blogModel.js";
import Comment from "../models/commentModel.js";

// add blog
export const addBlog = async (req, res) => {
  try {
    if (!req.body.blog || !req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Blog data and image are required." });
    }

    const blogData = JSON.parse(req.body.blog);
    const { title, subTitle, content, category, isPublished } = blogData;

    // Basic validation
    if (!title || !content || !category) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // Upload image to Cloudinary (BUFFER STREAM)
    cloudinary.uploader
      .upload_stream(
        {
          folder: "blogs",
          transformation: [
            { width: 1280 },
            { quality: "auto" },
            { fetch_format: "webp" },
          ],
        },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return res
              .status(500)
              .json({ success: false, message: "Image upload failed" });
          }

          await Blog.create({
            title,
            subTitle,
            description: content,
            category,
            isPublished: isPublished === "true",
            image: result.secure_url,
            imageId: result.public_id, // for delete/update
          });

          res
            .status(201)
            .json({ success: true, message: "Blog added successfully" });
        }
      )
      .end(req.file.buffer);
  } catch (error) {
    console.error("Add Blog Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// EDIT BLOG
export const editBlog = async (req, res) => {
  try {
    if (!req.body.blog) {
      return res
        .status(400)
        .json({ success: false, message: "Blog data is required." });
    }

    const blogData = JSON.parse(req.body.blog);
    const { id, title, subTitle, content, category, isPublished } = blogData;

    // Validate required fields
    if (!id || !title || !content || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all required fields." });
    }

    // Find existing blog
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // If new image is uploaded, replace old one
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (existingBlog.imageId) {
        await cloudinary.uploader.destroy(existingBlog.imageId);
      }

      // Upload new image
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "blogs",
            transformation: [
              { width: 1280 },
              { quality: "auto" },
              { fetch_format: "webp" },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });

      existingBlog.image = uploadResult.secure_url;
      existingBlog.imageId = uploadResult.public_id;
    }

    // Update other fields (with or without image)
    existingBlog.title = title;
    existingBlog.subTitle = subTitle;
    existingBlog.description = content;
    existingBlog.category = category;
    existingBlog.isPublished = isPublished === "true";

    await existingBlog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: existingBlog,
    });
  } catch (error) {
    console.error("Edit Blog Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error("Get Blogs Error:", error.message);

    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//get single blog
export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error("Get Blog By ID Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//delete blog
export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    await Comment.deleteMany({ blog: id });
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    // Delete image from cloudinary
    if (blog.imageId) await cloudinary.uploader.destroy(blog.imageId);
    await Blog.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete Blog Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//toggle blog publish status
export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res
      .status(200)
      .json({ success: true, message: "Blog publish status toggled", blog });
  } catch (error) {
    console.error("Toggle Publish Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//add comment
export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;
    await Comment.create({
      blog,
      name,
      content,
    });
    res
      .status(200)
      .json({ success: true, message: "Comment added for review" });
  } catch (error) {
    console.error("Add Comment Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//commnets by blog
export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;
    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });
    if (!comments) {
      res.status(404).json({ success: false, message: "NO COMMENTS FOUND" });
    }
    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error("get comments Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Generate content
export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;

    const improvedPrompt = `
      Write a clean blog article about: "${prompt}".
      - Start with a headline
      - Then a 2-3 line intro paragraph
      - Do NOT wrap content in backticks.
- Do NOT use \`\`\`html or any code block formatting.

      - Then sections with headings and short paragraphs
      - No prefixes like "Here is your content" or "As requested"
      - Use a conversational tone
      - Make it engaging and informative
      - Give in HTML format with proper tags
      - Use bullet points and numbered lists where appropriate
      - Use proper grammar and spelling
      - Include a conclusion paragraph summarizing the article
    `;

    const content = await main(improvedPrompt);

    return res.status(200).json({
      success: true,
      content: content?.trim(),
    });
  } catch (error) {
    console.error("Generate Content Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error, try again later.",
    });
  }
};

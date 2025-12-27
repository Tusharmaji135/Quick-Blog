import React, { useEffect, useRef, useState } from "react";
import { assets, blogCategories } from "../../assets/assets";
import Quill from "quill";
import toast from "react-hot-toast";
import { parse } from "marked";
import { useAppContext } from "../../context/AppContext";

const AddBlog = () => {
  const [image, setImage] = useState(false);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Startup");
  const [isPublished, setIsPublished] = useState(false);
  const { axios } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  // ---------------- GENERATE CONTENT ----------------
  const generateContent = async () => {
    if (!title.trim()) return toast.error("Please enter a title first");

    try {
      setLoading(true);

      // 🧹 Clear old text before generating new content
      if (quillRef.current) {
        quillRef.current.root.innerHTML = "";
      }

      const { data } = await axios.post(
        `/api/blog/generate`,
        { prompt: title },
        { withCredentials: true }
      );

      if (data?.success) {
        quillRef.current.root.innerHTML = data.content.trim();
        toast.success("New content generated!");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SUBMIT BLOG ----------------
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // FORM VALIDATION
    if (!image) return toast.error("Thumbnail image is required!");
    if (!title.trim()) return toast.error("Blog title is required!");
    if (!subTitle.trim()) return toast.error("Sub-title is required!");
    if (!category.trim()) return toast.error("Category is required!");

    const content = quillRef.current.root.innerHTML;
    if (!content || content.trim() === "" || content === "<p><br></p>") {
      return toast.error("Blog content cannot be empty!");
    }

    try {
      setIsAdding(true);

      const blog = {
        title,
        subTitle,
        category,
        isPublished: isPublished.toString(),
        content,
      };

      const formData = new FormData();
      formData.append("image", image);
      formData.append("blog", JSON.stringify(blog));

      const { data } = await axios.post(`/api/blog/add`, formData, {
        withCredentials: true,
      });

      if (data?.success) {
        toast.success(data?.message);

        // RESET FORM
        setImage(false);
        setTitle("");
        setSubTitle("");
        setCategory("Startup");
        setIsPublished(false);
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsAdding(false);
    }
  };

  // ---------------- INIT QUILL ----------------
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll"
    >
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        <p>Upload Thumbnail *</p>
        <label htmlFor="image">
          <img
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            className={`mt-2 rounded cursor-pointer ${image ? "h-40" : "h-16"}`}
          />
          <input
            name="image"
            type="file"
            id="image"
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        <p className="mt-4">Blog Title *</p>
        <input
          name="title"
          type="text"
          placeholder="Type here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
        />

        <p className="mt-4">Sub Title *</p>
        <input
          name="subTitle"
          type="text"
          placeholder="Type here"
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
        />

        <p className="mt-4">Blog Description *</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative border border-gray-300 rounded">
          <div ref={editorRef}></div>
          <button
            type="button"
            disabled={loading}
            className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline"
            onClick={generateContent}
          >
            {!loading ? "Generate with AI" : "Generating..."}
          </button>
        </div>

        <p className="mt-4">Blog Category *</p>
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
        >
          <option value="">Choose category</option>
          {blogCategories.filter(item=>item!=="All").map((item, idx) => (
            <option key={idx} value={item}>
              {item}
            </option>
          ))}
        </select>

        <div className="flex gap-2 mt-4">
          <p>Publish Now</p>
          <input
            name="isPublished"
            type="checkbox"
            checked={isPublished}
            className="scale-125 cursor-pointer accent-primary"
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </div>

        <button
          disabled={isAdding}
          type="submit"
          className="bg-primary mt-8 w-40 h-10 text-white rounded cursor-pointer text-sm"
        >
          {isAdding ? "Adding..." : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;

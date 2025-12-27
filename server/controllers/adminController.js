import jwt from "jsonwebtoken";
import Blog from "../models/blogModel.js";
import Comment from "../models/commentModel.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid admin credentials" });
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ success: true, message: "Admin logged in", token });
  } catch (error) {
    console.error("Admin login error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    if (!blogs) {
      return res
        .status(401)
        .json({ success: false, message: "NO BLOGS FOUND" });
    }
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error("get all blogs admin error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllCommentsAdmin = async (req, res) => {
  try {
    const comments = await Comment.find({})
      .populate("blog")
      .sort({ createdAt: -1 });
    if (!comments) {
      return res
        .status(401)
        .json({ success: false, message: "NO COMMENTS FOUND" });
    }
    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error("get all comments admin error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
    const blogs = await Blog.countDocuments();
    const comments = await Comment.countDocuments();
    const drafts = await Blog.countDocuments({ isPublished: false });

    const dashboardData = {
      blogs,
      comments,
      drafts,
      recentBlogs,
    };
    res.status(200).json({ success: true, dashboardData });
  } catch (error) {
    console.error("get Dashboard error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "COMMENT DELETED SUCCESSFULLY" });
  } catch (error) {
    console.error("deleted comment error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const approveCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndUpdate(id, { isApproved: true } );

    res
      .status(200)
      .json({ success: true, message: "COMMENT Approved SUCCESSFULLY" });
  } catch (error) {
    console.error("comment approved error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

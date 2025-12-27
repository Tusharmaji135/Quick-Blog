import express from "express";
import {
  addBlog,
  addComment,
  deleteBlogById,
  editBlog,
  generateContent,
  getBlogById,
  getBlogComments,
  getBlogs,
  togglePublish,
} from "../controllers/blogController.js";
import upload from "../middlewares/multer.js";
import { auth } from "../middlewares/auth.js";

const blogRouter = express.Router();

blogRouter.post("/add", upload.single("image"), auth, addBlog);
blogRouter.put("/edit", upload.single("image"), auth, editBlog);

blogRouter.get("/all", getBlogs);
blogRouter.get("/:blogId", getBlogById);
blogRouter.delete("/delete", auth, deleteBlogById);
blogRouter.patch("/toggle-publish", auth, togglePublish);
blogRouter.post("/add-comment", addComment);
blogRouter.post("/comments", getBlogComments);
blogRouter.post("/generate", auth, generateContent);

export default blogRouter;

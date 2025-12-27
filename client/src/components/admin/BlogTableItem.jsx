import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { FiEdit2 } from "react-icons/fi";


const BlogTableItem = ({ blog, fetchBlogs, index, handleEdit }) => {
  const { title, createdAt } = blog;
  const BlogDate = new Date(createdAt);
  const { axios, setBlogs } = useAppContext();
  const deleteBlog = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirm) return;
    try {
      const { data } = await axios.delete("/api/blog/delete", {
        data: { id: blog._id },
        withCredentials: true,
      });

      if (data?.success) {
        toast.success(data?.message);

        fetchBlogs();
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };
  const togglePublish = async () => {
    try {
      const { data } = await axios.patch(
        "/api/blog/toggle-publish",
        { id: blog._id },
        { withCredentials: true }
      );

      if (data?.success) {
        toast.success(data?.message);
        fetchBlogs();
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };
  return (
    <>
      <tr className="border-y border-gray-300">
        <th className="px-2 py-4">{index}</th>
        <td className="px-2 py-4">{title}</td>
        <td className="px-2 py-4 max-sm:hidden">
          {BlogDate.toLocaleDateString()}
        </td>
        <td className="px-2 py-4 max-sm:hidden">
          <p
            className={`${
              blog.isPublished ? "text-green-800" : "text-orange-700"
            }`}
          >
            {blog.isPublished ? "Published" : "Unpublished"}
          </p>
        </td>
        <td className="px-2 py-4 flex text-xs gap-3 items-center justify-center">
          <button
            onClick={togglePublish}
            className={`border px-2 py-0.5 mt-1 rounded cursor-pointer ${
              blog.isPublished
                ? "bg-red-400 text-white border-red-500 hover:bg-red-500"
                : "bg-green-400  text-white border-green-500 hover:bg-green-500"
            }`}
          >
            {blog.isPublished ? "Unpublish" : "Publish"}
          </button>
          <div className="flex gap-2">

          <button
            onClick={()=>handleEdit(blog)}
            className="border hover:scale-110 transition-all border-green-200 p-2.5 mt-1 rounded-full cursor-pointer "
          >
            <FiEdit2 size={12} color="green"/>

          </button>
          <img
            onClick={deleteBlog}
            src={assets.cross_icon}
            className="w-8 hover:scale-110 transition-all cursor-pointer"
            alt=""
          />
          </div>
        </td>
      </tr>
    </>
  );
};

export default BlogTableItem;

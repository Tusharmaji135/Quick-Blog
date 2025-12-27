import React, { use, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation, useParams } from "react-router-dom";
import { assets, blog_data, comments_data } from "../assets/assets";
import Moment from "moment";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Blog = () => {
  const { id } = useParams();
  const { axios,isAdmin,isViewer } = useAppContext();
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);

  const [name, setName] = useState(isAdmin ? isAdmin.name : isViewer ? isViewer.name : "");
  const [content, setContent] = useState("");

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`);
      if (data?.success) {
        setData(data?.blog);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };
  useEffect(() => {
    setName(isAdmin ? isAdmin.name : isViewer ? isViewer.name : "");
  }, [isAdmin,isViewer]);
  const fetchComments = async () => {
    try {
      const { data } = await axios.post(
        `/api/blog/comments`,
        { blogId: id },
        { withCredentials: true }
      );
      if (data?.success) {
        setComments(data?.comments);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };
  const addComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `/api/blog/add-comment`,
        { blog: id, name, content },
        { withCredentials: true }
      );
      if (data?.success) {
        toast.success(data?.message);
        setContent("");
        fetchComments();
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };
  useEffect(() => {
    fetchBlogData();
    fetchComments();
  }, []);
  return data ? (
    <div className="relative">
      <img
        src={assets.gradientBackground}
        alt="bg"
        className="absolute -top-50 -z-1 opacity-50"
      />
      <Navbar />
      <div className="text-center mt-20 text-gray-600">
        <p className="text-primary py-4 font-medium">
          Published on {Moment(data.createdAt).format("MMMM Do YYYY")}
        </p>
        <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto to-gray-800">
          {data.title}
        </h1>
        <h2 className="my-5 max-w-lg truncate mx-auto">{data.subTitle}</h2>
        <p className="inline-block bg-primary/5 py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 font-medium text-primary">
          {data.category}
        </p>
      </div>
      <div className="mx-2 max-w-6xl   md:mx-auto my-10 mt-6">
        <div className="flex flex-col">
          <img src={data.image} alt="" className=" rounded-3xl mb-5 " />
        </div>
        <div
          className="rich-text max-w-4xl mx-auto"
          dangerouslySetInnerHTML={{ __html: data.description }}
        />
        {/* {comment section} */}
        {comments.length > 0 && (
          <div className="mt-14 mb-10 max-w-3xl mx-auto">
            <p className="font-semibold mb-4">Comments ({comments.length})</p>
            <div className="flex flex-col gap-4">
              {comments.map((item, idx) => (
                <div
                  className="relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600"
                  key={idx}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <img src={assets.user_icon} className="w-6" alt="" />
                    <p className="font-medium">{item.name}</p>
                  </div>
                  <p className="text-sm max-w-md ml-8">{item.content}</p>
                  <div className=" absolute right-4 bottom-3 flex items-center gap-2 text-xs">
                    {Moment(item.createdAt).fromNow()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* add commnet */}
        <div className="max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Add your comment</p>
          <form
            onSubmit={addComment}
            className="flex flex-col items-start gap-4 max-w-lg"
          >
            <input
              type="text"
              placeholder="Name"
              value={name}
              readOnly
              required
              className="w-full p-2 border border-gray-300 rounded outline-none"
            />
            <textarea
              placeholder="Write your comment here..."
              className="w-full p-2 border border-gray-300 rounded outline-none h-48"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
            <button
              className="bg-primary text-white rounded p-2 px-8 hover:scale-102 transition-all cursor-pointer"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
        {/* share btn  */}
        <div className="mt-24 max-w-3xl mx-auto">
          <p className="font-semibold my-4">Share with your friends</p>
          <div className="flex">
            <img
              className="cursor-pointer hover:scale-102"
              src={assets.facebook_icon}
              width={50}
              alt=""
            />
            <img
              className="cursor-pointer hover:scale-102"
              src={assets.twitter_icon}
              width={50}
              alt=""
            />
            <img
              className="cursor-pointer hover:scale-102"
              src={assets.googleplus_icon}
              width={50}
              alt=""
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    <Loader />
  );
};

export default Blog;

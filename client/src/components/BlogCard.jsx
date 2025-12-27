import React from "react";
import { useNavigate } from "react-router-dom";

const categoryColors = {
  All: "bg-gray-200 text-gray-700",
  Technology: "bg-blue-200 text-blue-700",
  Startup: "bg-green-200 text-green-700",
  Lifestyle: "bg-pink-200 text-pink-700",
  Finance: "bg-yellow-200 text-yellow-700",
  Entertainment: "bg-purple-200 text-purple-700",
};
const BlogCard = ({ blog }) => {
  const { title, description, category, image, _id } = blog;
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/blog/${_id}`)}
      className="w-full rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-primary/25 duration-300 cursor-pointer"
    >
      <img src={image} alt="" className=" aspect-video" />
      <span
        className={`ml-5 mt-4 px-3 py-1 inline-block rounded-full text-xs ${
          categoryColors[category] || "bg-gray-200 text-gray-700"
        }`}
      >
        {category}
      </span>
      <div className="p-5">
        <h5 className="mb-2 font-medium text-gray-900">{title}</h5>
        <p
          className="mb-3 text-xs text-gray-600"
          dangerouslySetInnerHTML={{
            __html: description.trim().slice(0, 80) + "...",
          }}
        />
      </div>
    </div>
  );
};

export default BlogCard;

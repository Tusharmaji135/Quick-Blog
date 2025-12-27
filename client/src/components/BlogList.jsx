import React, { useState, useEffect } from "react";
import { blogCategories } from "../assets/assets";
import { motion } from "motion/react";
import BlogCard from "./BlogCard";
import { useAppContext } from "../context/AppContext";

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [page, setPage] = useState(1);

  // context values
  const { blogs, input, PAGE_SIZE, totalPages, setTotalPages } = useAppContext();

  // search filter
  const filteredBlogs = () => {
    if (!input) return blogs;
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(input.toLowerCase()) ||
        blog.category.toLowerCase().includes(input.toLowerCase())
    );
  };

  // category & search combined filter
  const categoryFiltered = filteredBlogs().filter((blog) =>
    menu === "All" ? true : blog.category.toLowerCase() === menu.toLowerCase()
  );

  // pagination slice
  const paginatedBlogs = categoryFiltered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // update total pages dynamically
  useEffect(() => {
    setTotalPages(Math.ceil(categoryFiltered.length / PAGE_SIZE));
    setPage(1); // reset to first page when category/search changes
  }, [blogs, menu, input]);

  // prev next handlers
  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="">
      {/* Category Menu */}
      <div className="flex justify-center gap-4 sm:gap-8 my-10 relative">
        {blogCategories.map((item) => (
          <div key={item} className="relative">
            <button
              onClick={() => setMenu(item)}
              className={`cursor-pointer text-gray-500 ${
                menu === item && "text-white px-4 pt-0.5"
              }`}
            >
              {item}
              {menu === item && (
                <motion.div
                  layoutId="underline"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute bg-primary h-7 left-0 right-0 top-0 -z-1 rounded-full"
                ></motion.div>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-15 mx-8 sm:mx-16 xl:mx-40">
        {paginatedBlogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}

        {/* If no blogs found */}
        {paginatedBlogs.length === 0 && (
          <p className="text-center col-span-full text-gray-500 text-lg">
            ❌ No blogs found
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="w-full flex items-center justify-center border-b border-gray-300 pb-10 mb-20">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`py-2 px-4 rounded-md ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-primary text-white"
            }`}
          >
            Prev
          </button>

          <span className="py-2 px-4 bg-primary text-white rounded-md">
            Page {page} / {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className={`py-2 px-4 rounded-md ${
              page === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-primary text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogList;

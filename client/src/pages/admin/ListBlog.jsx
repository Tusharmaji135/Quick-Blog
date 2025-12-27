import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import EditModal from "../../components/admin/EditModal";
import BlogTableItem from "../../components/admin/BlogTableItem"

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null); // store current editing blog
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { axios } = useAppContext();
  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };
  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/admin/blogs", {
        withCredentials: true,
      });
      if (data?.success) {
        setBlogs(data?.blogs);
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
    fetchBlogs();
  }, []);
  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <h1>All Blogs</h1>
      <div className="relative h-4/5 max-w-4xl mt-4 overflow-x-auto shadow rounded-lg  scrollbar-hide bg-white">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-xs text-gray-600 text-left uppercase">
            <tr>
              <th scope="col" className="px-2 py-4 xl:px-6">
                #
              </th>
              <th scope="col" className="px-2 py-4">
                Blog Title
              </th>
              <th scope="col" className="px-2 py-4 max-sm:hidden">
                Date
              </th>
              <th scope="col" className="px-2 py-4 max-sm:hidden">
                Status
              </th>
              <th scope="col" className="px-2 py-4 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, index) => {
              return (
                // ListBlog.jsx
                <BlogTableItem
                  key={blog._id}
                  blog={blog}
                  fetchBlogs={fetchBlogs}
                  index={index + 1}
                  handleEdit={handleEdit} // ⬅️ must be here
                />
              );
            })}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <EditModal
          blog={selectedBlog}
          closeModal={() => setIsModalOpen(false)}
          fetchBlogs={fetchBlogs}
        />
      )}
    </div>
  );
};

export default ListBlog;

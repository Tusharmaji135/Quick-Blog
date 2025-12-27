import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const AppContext = createContext();
const AppContextProvider = ({ children }) => {
  const PAGE_SIZE = 8;
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [input, setInput] = useState("");
  const [isAdmin, setIsAdmin] = useState(
    JSON.parse(localStorage.getItem("isAdmin")) || false
  );
  const [isViewer, setIsViewer] = useState(
    JSON.parse(localStorage.getItem("isViewer")) || false
  );

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/blog/all");
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

  const value = {
    axios,
    navigate,
    blogs,
    setBlogs,
    input,
    setInput,
    isAdmin,
    setIsAdmin,
    PAGE_SIZE,
    totalPages,
    setTotalPages,
    isViewer,
    setIsViewer,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
export default AppContextProvider;

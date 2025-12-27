import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { navigate, isAdmin, isViewer } = useAppContext();
  return (
    <nav className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32 cursor-pointer">
      <img
        onClick={() => {
          navigate("/");
          window.location.reload();
        }}
        src={assets.logo}
        alt="logo"
        className="w-32 sm:w-44"
      />
      <button
        onClick={() => {
          if (isAdmin) {
            navigate("/admin");
          }
          else if (isViewer) {
            localStorage.removeItem("isViewer");
            navigate("/");
            window.location.reload();
            toast.success("Logged out successfully");
          }else{
            navigate("/admin");
          }
        }}
        className={`flex items-center gap-2 rounded-full text-sm hover:bg-primary/95 cursor-pointer bg-primary text-white px-10 py-2.5 ${
          isViewer ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/95"
        }`}
      >
        {isAdmin ? "Dashboard" : isViewer ? "Logout" : "Login"}

        {<img src={assets.arrow} className="w-3" alt="arrow" />}
      </button>
    </nav>
  );
};

export default Navbar;

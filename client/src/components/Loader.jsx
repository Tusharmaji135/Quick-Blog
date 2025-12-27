import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className=" animate-spin transition border-gray-700 border-4 h-16 w-16 rounded-full border-t-white"></div>
    </div>
  );
};

export default Loader;

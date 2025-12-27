import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { setIsAdmin, axios ,navigate,isViewer,setIsViewer} = useAppContext();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/auth/register",
        { name, email, password },
        { withCredentials: true }
      );
      if(data?.success){
        toast.success(data?.message);
        navigate("/login");
      }else{
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong" );
    }
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full py-6 text-center">
            <h1 className="text-3xl font-bold">
              <span className="text-primary">USER</span> REGISTER
            </h1>
            <p className="font-light">
              Enter your crendentials to access the blogs
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-6 w-full sm:max-w-md text-gray-600"
          >
            <div className="flex flex-col">
              <label htmlFor="name">Name </label>
              <input
                type="name"
                name="name"
                id="name"
                required
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email">Email </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password">Password </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
              />
            </div>
            <button
              type="submit"
              className="bg-primary w-full py-3 font-medium text-white rounded cursor-pointer hover:bg-primary/90 transition-all"
            >
              Register
            </button>
            <p>
              Already have an account?{" "}
              <Link to={"/login"} className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

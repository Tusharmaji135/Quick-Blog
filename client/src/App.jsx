import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddBlog from "./pages/admin/AddBlog";
import ListBlog from "./pages/admin/ListBlog";
import Comments from "./pages/admin/Comments";
import Login from "./components/admin/Login";
import Register from "./components/admin/Register";
import { Toaster } from "react-hot-toast";
import "quill/dist/quill.snow.css";
import { useAppContext } from "./context/AppContext";
import ErrorPage from "./pages/ErrorPage";

const App = () => {
  const { isAdmin, isViewer } = useAppContext();
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/blog/:id" element={ isViewer || isAdmin ? <Blog /> : <Navigate to="/login" />} />

        {/* Auth pages */}
        <Route path="/login" element={ isViewer || isAdmin ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={ isViewer  || isAdmin ? <Navigate to="/" /> : <Register />} />

        {/* Protected admin area */}
        <Route path="/admin" element={isAdmin ? <Layout /> : <Login />}>
          <Route index element={<Dashboard />} />
          <Route path="addBlog" element={<AddBlog />} />
          <Route path="listBlog" element={<ListBlog />} />
          <Route path="comments" element={<Comments />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;

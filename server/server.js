import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from './configs/db.js'
import adminRouter from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser";
import blogRouter from "./routes/blogRoutes.js";
import authRouter from "./routes/authRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


// Routes
app.use("/api/admin",adminRouter)
app.use("/api/auth",authRouter)
app.use("/api/blog", blogRouter);

// Connect to the database
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port http://localhost:${PORT}`);
});

export default app;
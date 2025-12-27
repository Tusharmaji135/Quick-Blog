import express from "express";

import { auth } from "../middlewares/auth.js";
import { loginController, registerController } from "../controllers/authContollers.js";

const authRouter = express.Router();

authRouter.post("/login", loginController);
authRouter.post("/register",registerController);


export default authRouter;


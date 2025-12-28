import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { deleteResume, getPublicProfile, updateProfile } from "../controllers/userController.js";

export const userRouter=Router();

userRouter.put("/profile",protect,updateProfile)
userRouter.post("/resume",protect,deleteResume)

userRouter.get("/:id",getPublicProfile)
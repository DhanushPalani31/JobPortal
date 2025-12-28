// routes/authRoutes.js
import { Router } from "express";
import { login, getMe, register } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadImage } from "../controllers/uploadController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const authRouter = Router();

authRouter.post("/register", register);

authRouter.post("/login", login);
authRouter.get("/me", protect, getMe);
authRouter.post("/upload-image", upload.single("image"), uploadImage);

export default authRouter;

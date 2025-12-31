import { Router } from "express";
import { generateJobDescription, getAIStats } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

export const aiRouter = Router();

// Generate job description (protected route)
aiRouter.post("/generate-job-description", protect, generateJobDescription);

// Get AI statistics (optional - admin only)
aiRouter.get("/stats", protect, getAIStats);

export default aiRouter;
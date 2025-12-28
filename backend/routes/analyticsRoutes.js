import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getEmployerAnalytics } from "../controllers/analyticsController.js";

export const analyticsRouter=Router();

analyticsRouter.get("/overview",protect,getEmployerAnalytics);

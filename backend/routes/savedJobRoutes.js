import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMySavedJobs, saveJob, unsaveJob } from "../controllers/savedJobController.js";

export const savedJobsRouter=Router();

savedJobsRouter.post("/:jobId",protect,saveJob)
savedJobsRouter.delete("/:jobId",protect,unsaveJob)
savedJobsRouter.get("/my",protect,getMySavedJobs);
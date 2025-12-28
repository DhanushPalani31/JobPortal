import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { applyToJob, getApplicantsForJob, getApplicationById, getMyApplications, updateStatus } from "../controllers/applicationController.js";

export const applicationRouter=Router();


applicationRouter.post("/:jobId",protect,applyToJob);
applicationRouter.get("/my",protect,getMyApplications);
applicationRouter.get("/job/:jobId",protect,getApplicantsForJob);
applicationRouter.get("/:id",protect,getApplicationById);
applicationRouter.put("/:id/status",protect,updateStatus);

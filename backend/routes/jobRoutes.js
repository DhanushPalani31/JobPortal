import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createJob, deleteJob, getJobById, getJobs, getJobsEmployer, toggleCloseJob, updateJob } from "../controllers/jobController.js";

export const jobRouter=Router();

jobRouter.route("/").post(protect,createJob).get(getJobs);
jobRouter.route("/get-jobs-employer").get(protect,getJobsEmployer);
jobRouter.route("/:id").get(getJobById).put(protect,updateJob).delete(protect,deleteJob);
jobRouter.put("/:id/toggle-close",protect,toggleCloseJob)

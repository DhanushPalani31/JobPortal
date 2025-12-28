// controllers/savedJobController.js
import { SavedJob } from "../models/SavedJob.js";

export const saveJob = async (req, res) => {
  try {
    // Check if already saved
    const exists = await SavedJob.findOne({
      job: req.params.jobId,
      jobseeker: req.user._id,
    });

    if (exists) {
      return res.status(400).json({ message: "Job already saved" });
    }

    // ✅ IMPORTANT: use `job`, not `jobId`
    const saved = await SavedJob.create({
      job: req.params.jobId,
      jobseeker: req.user._id,
    });

    return res.status(201).json({
      message: "Job saved",
      saved,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to save job",
      error: error.message,
    });
  }
};

export const unsaveJob = async (req, res) => {
  try {
    const deleted = await SavedJob.findOneAndDelete({
      job: req.params.jobId,
      jobseeker: req.user._id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Job not found in your saved list" });
    }

    return res.json({ message: "Job removed from saved list" });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to unsave job",
      error: error.message,
    });
  }
};

export const getMySavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ jobseeker: req.user._id }).populate(
      {
        path: "job",
        populate: {
          path: "company",
          select: "name companyName companyLogo",
        },
      }
    );

    return res.json(savedJobs);
  } catch (error) {
    return res.status(400).json({
      message: "Failed to fetch my saved job",
      error: error.message,
    });
  }
};

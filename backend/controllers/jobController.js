import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";
import { SavedJob } from "../models/SavedJob.js";
import { User } from "../models/User.js";

export const createJob = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can post jobs" });
    }

    const job = await Job.create({
      ...req.body,
      company: req.user._id,
    });

    return res.status(201).json(job);
  } catch (error) {
    console.error("createJob error:", error);
    return res.status(400).json({ message: error.message });
  }
};


// Get Jobs (for jobseekers, listing with filters)
export const getJobs = async (req, res) => {
  const {
    keyword,
    location,
    category,
    type,
    minSalary,
    maxSalary,
    userId,
  } = req.query;

  try {
    const query = {
      isClosed: false,
    };

    // Text search filters
    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    // Salary filters
    if (minSalary || maxSalary) {
      query.$and = [];

      if (minSalary) {
        query.$and.push({
          salaryMax: { $gte: Number(minSalary) },
        });
      }

      if (maxSalary) {
        query.$and.push({
          salaryMax: { $lte: Number(maxSalary) },
        });
      }

      if (query.$and.length === 0) {
        delete query.$and;
      }
    }

    const jobs = await Job.find(query).populate(
      "company",
      "name companyName companyLogo"
    );

    let savedJobIds = [];
    let appliedJobStatusMap = {};

    // Saved jobs (only if userId provided)
    if (userId) {
      const savedJobs = await SavedJob.find({ jobseeker: userId }).select(
        "job"
      );
      savedJobIds = savedJobs.map((s) => String(s.job));

      // Applications (only if userId provided)
      const applications = await Application.find({
        applicant: userId,
      }).select("job status");

      applications.forEach((app) => {
        appliedJobStatusMap[String(app.job)] = app.status;
      });
    }

    const jobsWithExtras = jobs.map((job) => {
      const jobIdStr = String(job._id);
      return {
        ...job.toObject(),
        isSaved: savedJobIds.includes(jobIdStr),
        applicationStatus: appliedJobStatusMap[jobIdStr] || null,
      };
    });

    return res.status(200).json(jobsWithExtras);
  } catch (error) {
    console.error("getJobs error:", error);
    return res.status(400).json({ message: error.message });
  }
};


// Get Jobs for Employer (posted jobs + application counts)

export const getJobsEmployer = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { role } = req.user || {};

    if (!userId || role !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const jobs = await Job.find({ company: userId })
      .populate("company", "name companyName companyLogo")
      .lean(); // plain JS objects so we can add new fields

    const jobsWithApplicationCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({
          job: job._id,
        });

        return {
          ...job,
          applicationCount,
        };
      })
    );

    return res.json(jobsWithApplicationCounts);
  } catch (error) {
    console.error("getJobsEmployer error:", error);
    return res.status(400).json({ message: error.message });
  }
};


export const getJobById = async (req, res) => {
  try {
    const { userId } = req.query;

    const job = await Job.findById(req.params.id).populate(
      "company",
      "name companyName companyLogo"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    let applicantStatus = null;

    if (userId) {
      const application = await Application.findOne({
        job: job._id,
        applicant: userId,
      }).select("status");

      if (application) {
        applicantStatus = application.status;
      }
    }

    return res.json({
      ...job.toObject(),
      applicantStatus,
    });
  } catch (error) {
    console.error("getJobById error:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can update jobs" });
    }

    const jobId = req.params.id;

    const job = await Job.findOneAndUpdate(
      { _id: jobId, company: req.user._id }, // ensure employer owns the job
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found or you are not the owner" });
    }

    return res.json(job);
  } catch (error) {
    console.error("updateJob error:", error);
    return res.status(400).json({ message: error.message });
  }
};


export const deleteJob = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can delete jobs" });
    }

    const jobId = req.params.id;

    const job = await Job.findOneAndDelete({
      _id: jobId,
      company: req.user._id,
    });

    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found or you are not the owner" });
    }
    return res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("deleteJob error:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const toggleCloseJob = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "employer") {
      return res
        .status(403)
        .json({ message: "Only employers can close or open jobs" });
    }

    const jobId = req.params.id;

    const job = await Job.findOne({ _id: jobId, company: req.user._id });

    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found or you are not the owner" });
    }

    job.isClosed = !job.isClosed;
    await job.save();

    return res.json({
      message: `Job has been ${job.isClosed ? "closed" : "reopened"}`,
      job,
    });
  } catch (error) {
    console.error("toggleCloseJob error:", error);
    return res.status(400).json({ message: error.message });
  }
};

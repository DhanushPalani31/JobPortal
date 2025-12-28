import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";
import { User } from "../models/User.js";


//   Jobseeker applies to a job

export const applyToJob = async (req, res) => {
  try {
    // 1. Only jobseekers can apply
    if (!req.user || req.user.role !== "jobseeker") {
      return res
        .status(403)
        .json({ message: "Only job seekers can apply to jobs" });
    }

    const jobId = req.params.jobId;

    // 2. Check if job exists and is open
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.isClosed) {
      return res
        .status(400)
        .json({ message: "This job is closed and no longer accepting applications" });
    }

    // 3. Prevent duplicate applications
    const existing = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    // 4. Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume: req.user.resume || null, // assuming resume stored on user profile
      status: "Applied",
    });

    return res.status(201).json(application);
  } catch (error) {
    console.error("applyToJob error:", error);
    return res.status(500).json({ message: error.message });
  }
};


//  Get applications for logged in jobseeker

export const getMyApplications = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "jobseeker") {
      return res
        .status(403)
        .json({ message: "Only job seekers can view their applications" });
    }

    const apps = await Application.find({ applicant: req.user._id })
      .populate("job", "title company location type")
      .sort({ createdAt: -1 });

    if (!apps || apps.length === 0) {
      return res.status(400).json({ message: "No applications yet" });
    }


    return res.json(apps);
  } catch (error) {
    console.error("getMyApplications error:", error);
    return res.status(500).json({ message: error.message });
  }
};


//  Employer: get all applicants for a job they own

export const getApplicantsForJob = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "employer") {
      return res
        .status(403)
        .json({ message: "Only employers can view job applicants" });
    }

    const jobId = req.params.jobId;

    // Ensure the job exists and belongs to this employer
    const job = await Job.findOne({ _id: jobId, company: req.user._id });
    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found or you are not the owner" });
    }

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email resume")
      .sort({ createdAt: -1 });

    return res.json({
      job: {
        _id: job._id,
        title: job.title,
        location: job.location,
        type: job.type,
      },
      applications,
    });
  } catch (error) {
    console.error("getApplicantsForJob error:", error);
    return res.status(500).json({ message: error.message });
  }
};


//   Jobseeker: can view their own application
//   Employer: can view applications for their jobs

export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;       
    console.log(id)
    const application = await Application.findById(id)
      .populate("job", "title company location type company")
      .populate("applicant", "name email resume");
   console.log(application)
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const user = req.user;

    const isApplicant =
      user && String(application.applicant._id) === String(user._id);

    const job = await Job.findById(application.job?._id || application.job);
    const isEmployer =
      user &&
      user.role === "employer" &&
      job &&
      String(job.company) === String(user._id);

    if (!isApplicant && !isEmployer) {
      return res
        .status(403)
        .json({ message: "You are not allowed to view this application" });
    }

    return res.json(application);
  } catch (error) {
    console.error("getApplicationById error:", error);
    return res.status(500).json({ message: error.message });
  }
};


//   Employer updates status of an application (Applied → Under Review → Shortlisted → Rejected → Hired)

export const updateStatus = async (req, res) => {
  try {
   const {status}=req.body;
   const app=await Application.findById(req.params.id).populate("job");
   if(!app || app.job.company.toString() !== req.user._id.toString()){
    return res.ststus(403).json({message:"Not authorized to update this application"});
   }
   app.status=status;
   await app.save();
   res.json({message:"Application status updated successfully",status})
  } catch (error) {
    console.error("updateStatus error:", error);
    return res.status(500).json({ message: error.message });
  }
};

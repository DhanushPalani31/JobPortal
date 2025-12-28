import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Eye,
} from "lucide-react";
import { API_PATHS } from "../utils/apiPaths";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosinstance";
import { CATEGORIES, JOB_TYPES } from "../utils/data";
import toast from "react-hot-toast";
import InputField from "../../components/Input/InputField";
import SelectField from "../../components/Input/SelectField";
import TextareaField from "../../components/Input/TextareaField";
import JobPostingPreview from "../../components/Cards/JobPostingPreview";

const JobPostingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId || null;

  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    category: "",
    jobType: "",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  /* ---------------- INPUT ---------------- */
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field] || errors.salary) {
      setErrors((prev) => ({ ...prev, [field]: "", salary: "" }));
    }
  };

  /* ---------------- VALIDATION ---------------- */
  const validateForm = (data) => {
    const errors = {};
    if (!data.jobTitle.trim()) errors.jobTitle = "Job title is required";
    if (!data.category) errors.category = "Please select a category";
    if (!data.jobType) errors.jobType = "Please select a job type";
    if (!data.description.trim()) errors.description = "Job description is required";
    if (!data.requirements.trim()) errors.requirements = "Job requirements are required";

    if (!data.salaryMin || !data.salaryMax)
      errors.salary = "Both salary fields are required";
    else if (parseInt(data.salaryMin) >= parseInt(data.salaryMax))
      errors.salary = "Maximum salary must be greater";

    return errors;
  };

  const isFormValid = () => Object.keys(validateForm(formData)).length === 0;

  /* ---------------- FETCH JOB WHEN EDITING ---------------- */
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;

      try {
        const response = await axiosInstance.get(
          API_PATHS.JOBS.GET_JOBS_BY_ID(jobId)
        );

        const jobData = response.data;
        if (jobData) {
          setFormData({
            jobTitle: jobData.title || "",
            location: jobData.location || "",
            category: jobData.category || "",
            jobType: jobData.type || "",
            description: jobData.description || "",
            requirements: jobData.requirements || "",
            salaryMin: jobData.salaryMin || "",
            salaryMax: jobData.salaryMax || "",
          });
        }
      } catch (error) {
        console.error("Error fetching job details");
        if (error.response) {
          console.error("API Error:", error.response.data.message);
        }
      }
    };

    fetchJobDetails();
  }, [jobId]);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.jobTitle,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        category: formData.category,
        type: formData.jobType,
        salaryMin: formData.salaryMin,
        salaryMax: formData.salaryMax,
      };

      jobId
        ? await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOBS(jobId), payload)
        : await axiosInstance.post(API_PATHS.JOBS.POST_JOB, payload);

      toast.success(jobId ? "Job Updated!" : "Job Posted!");
      navigate("/employer-dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit job");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------- PREVIEW ---------------- */
  if (isPreview) {
    return (
      <DashboardLayout activeMenu="post-job">
        <JobPostingPreview formData={formData} setIsPreview={setIsPreview} />
      </DashboardLayout>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <DashboardLayout activeMenu="post-job">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">

          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-bold">Post a New Job</h2>

            <button
              onClick={() => setIsPreview(true)}
              disabled={!isFormValid()}
              className="group flex items-center px-4 py-2 rounded 
                         bg-gray-100 text-gray-700 
                         hover:bg-blue-600 hover:text-white
                         transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Preview
            </button>
          </div>

          <InputField
            label="Job Title"
            value={formData.jobTitle}
            onChange={(e) => handleInputChange("jobTitle", e.target.value)}
            error={errors.jobTitle}
            icon={Briefcase}
            required
          />

          <InputField
            label="Location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            icon={MapPin}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              label="Category"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              options={CATEGORIES}
              error={errors.category}
              required
            />
            <SelectField
              label="Job Type"
              value={formData.jobType}
              onChange={(e) => handleInputChange("jobType", e.target.value)}
              options={JOB_TYPES}
              error={errors.jobType}
              required
            />
          </div>

          <TextareaField
            label="Job Description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            error={errors.description}
            required
          />

          <TextareaField
            label="Requirements"
            value={formData.requirements}
            onChange={(e) => handleInputChange("requirements", e.target.value)}
            error={errors.requirements}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              type="number"
              label="Min Salary"
              value={formData.salaryMin}
              onChange={(e) => handleInputChange("salaryMin", e.target.value)}
              icon={DollarSign}
            />
            <InputField
              type="number"
              label="Max Salary"
              value={formData.salaryMax}
              onChange={(e) => handleInputChange("salaryMax", e.target.value)}
              icon={DollarSign}
            />
          </div>

          {errors.salary && <p className="text-red-600">{errors.salary}</p>}

          <button
            disabled={isSubmitting || !isFormValid()}
            onClick={handleSubmit}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded"
          >
            {isSubmitting ? "Publishing..." : "Publish Job"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobPostingForm;

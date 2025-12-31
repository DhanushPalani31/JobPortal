import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Eye,
  Save,
  ArrowLeft,
  Tag,
  FileText,
  AlertCircle,
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
import AIJobHelper from "./components/AIJobHelper";

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
  const [touched, setTouched] = useState({});

  /* ---------------- AI GENERATE HANDLER ---------------- */
  const handleAIGenerate = (content) => {
    if (content.description) {
      setFormData((prev) => ({ ...prev, description: content.description }));
      // Clear error when AI generates content
      setErrors((prev) => ({ ...prev, description: "" }));
    }
    if (content.requirements) {
      setFormData((prev) => ({ ...prev, requirements: content.requirements }));
      // Clear error when AI generates content
      setErrors((prev) => ({ ...prev, requirements: "" }));
    }
  };

  /* ---------------- INPUT CHANGE ---------------- */
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Mark field as touched
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // Clear errors for this field
    if (errors[field] || errors.salary) {
      setErrors((prev) => ({ ...prev, [field]: "", salary: "" }));
    }
  };

  /* ---------------- VALIDATION ---------------- */
  const validateForm = (data) => {
    const errors = {};
    
    // Job Title
    if (!data.jobTitle.trim()) {
      errors.jobTitle = "Job title is required";
    } else if (data.jobTitle.trim().length < 3) {
      errors.jobTitle = "Job title must be at least 3 characters";
    }

    // Location
    if (!data.location.trim()) {
      errors.location = "Location is required";
    }

    // Category
    if (!data.category) {
      errors.category = "Please select a category";
    }

    // Job Type
    if (!data.jobType) {
      errors.jobType = "Please select a job type";
    }

    // Description
    if (!data.description.trim()) {
      errors.description = "Job description is required";
    } else if (data.description.trim().length < 100) {
      errors.description = "Description should be at least 100 characters";
    }

    // Requirements
    if (!data.requirements.trim()) {
      errors.requirements = "Job requirements are required";
    } else if (data.requirements.trim().length < 50) {
      errors.requirements = "Requirements should be at least 50 characters";
    }

    // Salary Validation
    if (!data.salaryMin || !data.salaryMax) {
      errors.salary = "Both minimum and maximum salary are required";
    } else {
      const min = parseInt(data.salaryMin);
      const max = parseInt(data.salaryMax);

      if (isNaN(min) || isNaN(max)) {
        errors.salary = "Salary must be a valid number";
      } else if (min < 0 || max < 0) {
        errors.salary = "Salary cannot be negative";
      } else if (min >= max) {
        errors.salary = "Maximum salary must be greater than minimum";
      } else if (max - min < 5000) {
        errors.salary = "Salary range should be at least $5,000";
      }
    }

    return errors;
  };

  const isFormValid = () => Object.keys(validateForm(formData)).length === 0;

  /* ---------------- FIELD VALIDATION ON BLUR ---------------- */
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // Validate single field
    const fieldErrors = validateForm(formData);
    if (fieldErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
    }
  };

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
        console.error("Error fetching job details:", error);
        toast.error("Failed to load job details");
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

    // Validate all fields
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      
      // Mark all fields as touched to show errors
      const allTouched = Object.keys(formData).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      // Show error toast
      toast.error("Please fix all errors before submitting");
      
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }
      
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.jobTitle.trim(),
        description: formData.description.trim(),
        requirements: formData.requirements.trim(),
        location: formData.location.trim(),
        category: formData.category,
        type: formData.jobType,
        salaryMin: parseInt(formData.salaryMin),
        salaryMax: parseInt(formData.salaryMax),
      };

      if (jobId) {
        await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOBS(jobId), payload);
        toast.success("Job updated successfully!");
      } else {
        await axiosInstance.post(API_PATHS.JOBS.POST_JOB, payload);
        toast.success("Job posted successfully!");
      }

      // Navigate to manage jobs or dashboard
      navigate("/manage-jobs");
    } catch (err) {
      console.error("Submit error:", err);
      const errorMessage = err.response?.data?.message || "Failed to submit job";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------- SAVE AS DRAFT ---------------- */
  const handleSaveAsDraft = () => {
    // Save to localStorage
    localStorage.setItem("jobDraft", JSON.stringify(formData));
    toast.success("Draft saved successfully!");
  };

  /* ---------------- LOAD DRAFT ---------------- */
  useEffect(() => {
    // Load draft if not editing existing job
    if (!jobId) {
      const draft = localStorage.getItem("jobDraft");
      if (draft) {
        try {
          const parsedDraft = JSON.parse(draft);
          setFormData(parsedDraft);
          toast.info("Draft loaded");
        } catch (error) {
          console.error("Error loading draft:", error);
        }
      }
    }
  }, [jobId]);

  /* ---------------- CLEAR DRAFT ---------------- */
  const handleClearDraft = () => {
    localStorage.removeItem("jobDraft");
    setFormData({
      jobTitle: "",
      location: "",
      category: "",
      jobType: "",
      description: "",
      requirements: "",
      salaryMin: "",
      salaryMax: "",
    });
    setErrors({});
    setTouched({});
    toast.success("Draft cleared");
  };

  /* ---------------- PREVIEW ---------------- */
  if (isPreview) {
    return (
      <DashboardLayout activeMenu="post-job">
        <JobPostingPreview formData={formData} setIsPreview={setIsPreview} />
      </DashboardLayout>
    );
  }

  /* ---------------- CALCULATE FORM COMPLETION ---------------- */
  const getFormCompletionPercentage = () => {
    const totalFields = Object.keys(formData).length;
    const filledFields = Object.values(formData).filter(
      (value) => value && value.toString().trim() !== ""
    ).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  const completionPercentage = getFormCompletionPercentage();

  /* ---------------- UI ---------------- */
  return (
    <DashboardLayout activeMenu="post-job">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {jobId ? "Edit Job Posting" : "Post a New Job"}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {jobId
                      ? "Update your job posting details"
                      : "Fill in the details to post a new job"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPreview(true)}
                disabled={!isFormValid()}
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
              >
                <Eye className="h-4 w-4 transition-transform group-hover:scale-110" />
                Preview Job
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Form Completion
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            {/* AI Job Helper */}
            <AIJobHelper
              onGenerate={handleAIGenerate}
              currentJobTitle={formData.jobTitle}
            />

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Basic Information
                  </h2>
                </div>

                <InputField
                  label="Job Title"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  onBlur={() => handleBlur("jobTitle")}
                  error={touched.jobTitle ? errors.jobTitle : ""}
                  icon={Briefcase}
                  placeholder="e.g., Senior Software Engineer"
                  required
                />

                <InputField
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  onBlur={() => handleBlur("location")}
                  error={touched.location ? errors.location : ""}
                  icon={MapPin}
                  placeholder="e.g., San Francisco, CA or Remote"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    onBlur={() => handleBlur("category")}
                    options={CATEGORIES}
                    error={touched.category ? errors.category : ""}
                    icon={Tag}
                    placeholder="Select category"
                    required
                  />
                  <SelectField
                    label="Job Type"
                    name="jobType"
                    value={formData.jobType}
                    onChange={(e) => handleInputChange("jobType", e.target.value)}
                    onBlur={() => handleBlur("jobType")}
                    options={JOB_TYPES}
                    error={touched.jobType ? errors.jobType : ""}
                    icon={Briefcase}
                    placeholder="Select job type"
                    required
                  />
                </div>
              </div>

              {/* Job Details Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Job Details
                  </h2>
                </div>

                <TextareaField
                  label="Job Description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  onBlur={() => handleBlur("description")}
                  error={touched.description ? errors.description : ""}
                  placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                  helperText={`${formData.description.length} characters (minimum 100)`}
                  rows={8}
                  required
                />

                <TextareaField
                  label="Requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange("requirements", e.target.value)}
                  onBlur={() => handleBlur("requirements")}
                  error={touched.requirements ? errors.requirements : ""}
                  placeholder="List the qualifications, skills, and experience required for this role..."
                  helperText={`${formData.requirements.length} characters (minimum 50)`}
                  rows={8}
                  required
                />
              </div>

              {/* Compensation Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Compensation
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    type="number"
                    label="Minimum Salary (USD/year)"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                    onBlur={() => handleBlur("salaryMin")}
                    icon={DollarSign}
                    placeholder="e.g., 80000"
                    min="0"
                    required
                  />
                  <InputField
                    type="number"
                    label="Maximum Salary (USD/year)"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                    onBlur={() => handleBlur("salaryMax")}
                    icon={DollarSign}
                    placeholder="e.g., 120000"
                    min="0"
                    required
                  />
                </div>

                {errors.salary && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-600">{errors.salary}</p>
                  </div>
                )}

                {formData.salaryMin && formData.salaryMax && !errors.salary && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">Salary Range:</span> $
                      {parseInt(formData.salaryMin).toLocaleString()} - $
                      {parseInt(formData.salaryMax).toLocaleString()} per year
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleSaveAsDraft}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Save as Draft
                </button>

                {!jobId && (
                  <button
                    type="button"
                    onClick={handleClearDraft}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Clear Form
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid()}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {jobId ? "Updating..." : "Publishing..."}
                    </>
                  ) : (
                    <>
                      <Briefcase className="h-4 w-4" />
                      {jobId ? "Update Job" : "Publish Job"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobPostingForm;
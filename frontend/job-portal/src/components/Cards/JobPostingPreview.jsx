import React from "react";
import {
  MapPin,
  DollarSign,
  ArrowLeft,
  Building2,
  Clock,
  Users,
} from "lucide-react";
import { CATEGORIES, JOB_TYPES } from "../../pages/utils/data";
import { useAuth } from "../../context/AuthContext";

const JobPostingPreview = ({ formData, setIsPreview }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8 backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl rounded-2xl px-6 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Job Preview
            </h2>

            <button
              onClick={() => setIsPreview(false)}
              className="group flex items-center space-x-2 px-6 py-3 text-xs md:text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to edit</span>
            </button>
          </div>

          {/* Hero */}
          <div className="relative bg-white pb-8 mt-8 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-lg lg:text-xl font-semibold mb-2 text-gray-900">
                  {formData.jobTitle}
                </h1>

                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {formData.location || "Remote"}
                  </span>
                </div>
              </div>

              {user?.companyLogo ? (
                <img
                  src={user.companyLogo}
                  alt="Company Logo"
                  className="h-16 w-16 md:h-20 md:w-20 object-cover rounded-2xl border-4 border-white shadow-lg"
                />
              ) : (
                <div className="h-16 w-16 md:h-20 md:w-20 bg-gray-50 border-2 border-gray-200 rounded-2xl flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="px-4 py-2 bg-blue-50 text-sm text-blue-700 font-semibold rounded-full border border-blue-200">
                {CATEGORIES.find(c => c.value === formData.category)?.label}
              </span>

              <span className="px-4 py-2 bg-purple-50 text-sm text-purple-700 font-semibold rounded-full border border-purple-200">
                {JOB_TYPES.find(j => j.value === formData.jobType)?.label}
              </span>

              <div className="flex items-center space-x-1 px-4 py-2 bg-gray-50 text-sm text-gray-700 font-semibold rounded-full border border-gray-200">
                <Clock className="h-4 w-4" />
                <span>Posted today</span>
              </div>
            </div>
          </div>

          {/* Salary */}
          <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-6 rounded-2xl flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Compensation</p>
                <p className="text-lg font-bold text-gray-900">
                  ${Number(formData.salaryMin).toLocaleString()} – $
                  {Number(formData.salaryMax).toLocaleString()} / year
                </p>
              </div>
            </div>
            <div className="flex items-center text-emerald-700 text-sm">
              <Users className="h-4 w-4 mr-1" /> Competitive
            </div>
          </div>

          {/* Description */}
          <div className="mt-10 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">About this role</h3>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-sm text-gray-700 whitespace-pre-wrap">
                {formData.description}
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                What we’re looking for
              </h3>
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 text-sm text-gray-700 whitespace-pre-wrap">
                {formData.requirements}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobPostingPreview;

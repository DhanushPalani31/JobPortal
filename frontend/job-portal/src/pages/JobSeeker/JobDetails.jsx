import { MapPin, DollarSign, Building2, Clock, Users } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useParams } from "react-router-dom"
import axiosInstance from "../utils/axiosinstance"
import { API_PATHS } from "../utils/apiPaths"
import { useEffect, useState } from "react"
import Navbar from "../../components/layout/Navbar"
import moment from "moment"
import StatusBadge from "../../components/layout/StatusBadge"
import toast from "react-hot-toast"

const JobDetails = () => {
  const { user } = useAuth()
  const { jobid } = useParams() // ✅ Fixed: using jobid to match route parameter

  const [jobDetails, setJobDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  const getJobDetailsById = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(
        API_PATHS.JOBS.GET_JOBS_BY_ID(jobid), // ✅ Fixed: using jobid instead of jobId
        {
          params: { userId: user?._id || null }
        }
      )
      setJobDetails(response.data)
    } catch (error) {
      console.error("Error fetching job details", error)
      toast.error("Failed to load job details")
    } finally {
      setLoading(false)
    }
  }

  const applyToJob = async () => {
    try {
      if (jobid) { // ✅ Fixed: using jobid instead of jobId
        await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobid))
        toast.success("Applied to job successfully!")
      }
      getJobDetailsById()
    } catch (err) {
      console.log("Error:", err)
      const errormsg = err?.response?.data?.message
      toast.error(errormsg || "Something went wrong! Try again later")
    }
  }

  useEffect(() => {
    if (jobid && user) { // ✅ Fixed: using jobid instead of jobId
      getJobDetailsById()
    }
  }, [jobid, user])

  // ✅ Added loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="container mx-auto pt-24">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading job details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ✅ Added no data state
  if (!jobDetails) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="container mx-auto pt-24">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h3>
              <p className="text-gray-600">The job you're looking for doesn't exist or has been removed.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Main content card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto">
          {/* Hero section with clean background */}
          <div className="relative px-6 lg:px-8 py-8 border-b border-gray-100">
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
                {jobDetails?.company?.companyLogo ? (
                  <img
                    src={jobDetails.company.companyLogo}
                    alt="Company Logo"
                    className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-2xl border-4 border-white shadow-lg flex-shrink-0"
                  />
                ) : (
                  <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gray-50 border-2 border-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h1 className="text-xl lg:text-2xl font-bold mb-2 leading-tight text-gray-900">
                    {jobDetails.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{jobDetails.location}</span>
                    </div>
                    {jobDetails?.company?.companyName && (
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm font-medium">{jobDetails.company.companyName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Apply Button - Desktop */}
                <div className="hidden sm:block flex-shrink-0">
                  {jobDetails?.applicantStatus ? (
                    <StatusBadge status={jobDetails.applicantStatus} />
                  ) : (
                    <button 
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      onClick={applyToJob}
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-blue-50 text-sm text-blue-700 font-semibold rounded-full border border-blue-200">
                  {jobDetails.category}
                </span>
                <span className="px-4 py-2 text-sm bg-purple-50 text-purple-700 font-semibold rounded-full border border-purple-200">
                  {jobDetails.type}
                </span>
                <div className="flex items-center space-x-1 px-4 py-2 bg-gray-50 text-sm text-gray-700 font-semibold rounded-full border border-gray-200">
                  <Clock className="h-4 w-4" />
                  <span>
                    {jobDetails.createdAt
                      ? moment(jobDetails.createdAt).format("Do MMM YYYY")
                      : "N/A"}
                  </span>
                </div>
              </div>

              {/* Apply Button - Mobile */}
              <div className="sm:hidden mt-6">
                {jobDetails?.applicantStatus ? (
                  <StatusBadge status={jobDetails.applicantStatus} />
                ) : (
                  <button 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg"
                    onClick={applyToJob}
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="px-6 lg:px-8 py-8 space-y-8">
            {/* Salary section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-6 rounded-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex-shrink-0">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        Compensation
                      </h3>
                      <div className="text-lg font-bold text-gray-900">
                        ${jobDetails.salaryMin?.toLocaleString()} - ${jobDetails.salaryMax?.toLocaleString()}
                        <span className="text-sm text-gray-600 font-normal ml-1">
                          per year
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full self-start sm:self-auto">
                    <Users className="h-4 w-4" />
                    <span>Competitive</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-4">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                <span>About This Role</span>
              </h3>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                <div className="text-sm lg:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {jobDetails.description}
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                <span>What We're Looking For</span>
              </h3>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-6">
                <div className="text-sm lg:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {jobDetails.requirements}
                </div>
              </div>
            </div>

            {/* Company Info (if available) */}
            {jobDetails?.company?.companyDescription && (
              <div className="space-y-4">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center space-x-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  <span>About the Company</span>
                </h3>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                  <div className="text-sm lg:text-base text-gray-700 leading-relaxed">
                    {jobDetails.company.companyDescription}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Apply Button */}
            <div className="pt-6 border-t border-gray-200">
              {jobDetails?.applicantStatus ? (
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Application Status:</p>
                  <StatusBadge status={jobDetails.applicantStatus} />
                </div>
              ) : (
                <button 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl text-lg"
                  onClick={applyToJob}
                >
                  Apply for this Position
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetails
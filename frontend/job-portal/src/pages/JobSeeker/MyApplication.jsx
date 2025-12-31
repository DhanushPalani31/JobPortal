import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Briefcase, Calendar, MapPin, Building2 } from "lucide-react"
import axiosInstance from "../utils/axiosinstance"
import { API_PATHS } from "../utils/apiPaths"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/layout/Navbar"
import StatusBadge from "../../components/layout/StatusBadge"
import moment from "moment"
import toast from "react-hot-toast"

const MyApplications = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("All")

  const getMyApplications = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(API_PATHS.APPLICATIONS.GET_MY_APPLICATIONS)
      
      if (response.status === 200) {
        setApplications(response.data || [])
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
      if (error.response?.status === 404) {
        setApplications([])
      } else {
        toast.error("Failed to load applications")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      getMyApplications()
    }
  }, [user])

  // Filter applications by status
  const filteredApplications = filterStatus === "All" 
    ? applications 
    : applications.filter(app => app.status === filterStatus)

  // Loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
        <Navbar />
        <div className="container mx-auto pt-24 px-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your applications...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto pt-24 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center space-x-2 px-3.5 py-2.5 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300 shadow-lg shadow-gray-100 hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>Back</span>
              </button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  My Applications
                </h1>
                <p className="text-gray-600 mt-1">
                  Track your job applications and their status
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            {applications.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {["All", "Applied", "In Review", "Accepted", "Rejected"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filterStatus === status
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status}
                      {status === "All" && (
                        <span className="ml-2 text-xs">({applications.length})</span>
                      )}
                      {status !== "All" && (
                        <span className="ml-2 text-xs">
                          ({applications.filter(app => app.status === status).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <div className="text-center py-16 lg:py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-gray-300 mb-6">
                <Briefcase className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                {filterStatus === "All" 
                  ? "No applications yet" 
                  : `No ${filterStatus.toLowerCase()} applications`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filterStatus === "All"
                  ? "Start applying to jobs that interest you!"
                  : "Try selecting a different filter"}
              </p>
              {filterStatus === "All" && (
                <button
                  onClick={() => navigate("/find-jobs")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Browse Jobs
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <ApplicationCard
                  key={application._id}
                  application={application}
                  onClick={() => navigate(`/job/${application.job._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Application Card Component
const ApplicationCard = ({ application, onClick }) => {
  const { job, status, createdAt } = application

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left side - Job Info */}
        <div className="flex items-start gap-4 flex-1">
          {job?.company?.companyLogo ? (
            <img
              src={job.company.companyLogo}
              alt="Company Logo"
              className="w-14 h-14 object-cover rounded-xl border-2 border-gray-100 flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 className="h-6 w-6 text-gray-400" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
              {job?.title || "Job Title Not Available"}
            </h3>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
              {job?.company?.companyName && (
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span>{job.company.companyName}</span>
                </div>
              )}
              {job?.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
              )}
              {job?.type && (
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  {job.type}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="h-3.5 w-3.5" />
              <span>Applied {moment(createdAt).fromNow()}</span>
              <span>•</span>
              <span>{moment(createdAt).format("MMM D, YYYY")}</span>
            </div>
          </div>
        </div>

        {/* Right side - Status */}
        <div className="flex items-center gap-3 lg:flex-col lg:items-end">
          <StatusBadge status={status} />
          <button
            onClick={onClick}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyApplications
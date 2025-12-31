import { useState, useEffect } from "react"
import { Briefcase, Bookmark, FileText } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import ProfileDropdown from "./ProfileDropdown"

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) setProfileDropdownOpen(false)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [profileDropdownOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/find-jobs" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">JobPortal</span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center space-x-3">

            {/* Jobseeker icons */}
            {user && user.role === "jobseeker" && (
              <>
                <button
                  className="p-2 rounded-xl hover:bg-gray-100 transition"
                  onClick={() => navigate("/my-applications")}
                  title="My Applications"
                >
                  <FileText className="h-5 w-5 text-gray-500" />
                </button>

                <button
                  className="p-2 rounded-xl hover:bg-gray-100 transition"
                  onClick={() => navigate("/saved-jobs")}
                  title="Saved Jobs"
                >
                  <Bookmark className="h-5 w-5 text-gray-500" />
                </button>
              </>
            )}

            {isAuthenticated ? (
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onToggle={(e) => {
                  e.stopPropagation()
                  setProfileDropdownOpen(!profileDropdownOpen)
                }}
                avatar={user?.avatar || ""}
                companyName={user?.name || ""}
                email={user?.email || ""}
                userRole={user?.role || ""}
                onLogout={logout}
              />
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition shadow"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar

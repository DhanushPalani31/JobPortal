import { Save, X, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import axiosInstance from "../utils/axiosinstance"
import { API_PATHS } from "../utils/apiPaths"
import toast from "react-hot-toast"
import uploadImage from "../utils/uploadimage"
import Navbar from "../../components/layout/Navbar"
import { Link } from "react-router-dom"

const UserProfile = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    resume: user?.resume || ""
  })

  const [formData, setFormData] = useState({ ...profileData });
  const [uploading, setUploading] = useState({ avatar: false, resume: false })
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (file, type) => {
    setUploading((prev) => ({ ...prev, [type]: true }))
    try {
      const uploadRes = await uploadImage(file);
      const fileUrl = uploadRes.imageUrl || "";

      handleInputChange(type, fileUrl)
      toast.success(`${type === "avatar" ? "Avatar" : "Resume"} uploaded successfully!`);
    } catch (error) {
      console.error("Upload failed:", error)
      toast.error(`Failed to upload ${type}. Please try again.`);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }))
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (!file) return;

    // Validate based on type
    if (type === "avatar") {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a JPG or PNG image');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
    } else if (type === "resume") {
      const allowedTypes = ['application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Resume must be less than 5MB');
        return;
      }
    }

    // Create preview for images only
    if (type === "avatar") {
      const previewUrl = URL.createObjectURL(file);
      handleInputChange(type, previewUrl)
    }

    handleImageUpload(file, type)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData
      )
      if (response.status === 200) {
        toast.success("Profile updated successfully!")
        setProfileData({ ...formData })
        updateUser({ ...formData })
      }
    } catch (error) {
      console.error("Profile update failed:", error)
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({ ...profileData })
  }

  const DeleteResume = async () => {
    setSaving(true)
    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.DELETE_RESUME,
        {
          resumeUrl: user?.resume || ""
        }
      )
      if (response.status === 200) {
        toast.success("Resume deleted successfully!")
        const updatedData = { ...formData, resume: "" }
        setProfileData(updatedData)
        setFormData(updatedData)
        updateUser(updatedData)
      }
    } catch (error) {
      console.error("Resume deletion failed:", error)
      toast.error("Failed to delete resume. Please try again.");
    } finally {
      setSaving(false)
    }
  };

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
        resume: user.resume || ""
      }
      setProfileData(userData)
      setFormData(userData)
    }
  }, [user])

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4 mt-16 lg:mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 flex justify-between items-center">
              <h1 className="text-xl font-medium text-white">Profile</h1>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {formData?.avatar ? (
                      <img
                        src={formData.avatar}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600">
                          {formData?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                    {uploading?.avatar && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block">
                      <span className="sr-only">Choose avatar</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={(e) => handleFileChange(e, "avatar")}
                        disabled={uploading?.avatar}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors disabled:opacity-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email {Read-only} */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                {/* Resume Section */}
                {formData.resume ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600 truncate">
                          <a
                            href={formData.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            View Resume
                          </a>
                        </p>
                      </div>
                      <button 
                        onClick={DeleteResume}
                        disabled={saving}
                        className="ml-4 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume</label>
                    <label className="block">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(e, "resume")}
                        disabled={uploading?.resume}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors disabled:opacity-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">PDF up to 5MB</p>
                    </label>
                    {uploading?.resume && (
                      <p className="text-sm text-blue-600 mt-2">Uploading resume...</p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                <Link
                  to='/find-jobs'
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </Link>

                <button
                  onClick={handleSave}
                  disabled={saving || uploading.avatar || uploading.resume}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
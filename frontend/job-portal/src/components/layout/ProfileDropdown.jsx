import React from "react";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyName = "",
  email = "",
  userRole = "employer",
  onLogout,
}) => {
  const navigate = useNavigate();

  const handleProfileNavigate = () => {
    navigate(userRole === "jobseeker" ? "/profile" : "/company-profile");
  };

  return (
    <div className="relative profile-dropdown">
      {/* ================= BUTTON ================= */}
      <button
        onClick={onToggle}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition"
      >
        {/* Avatar */}
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="h-9 w-9 rounded-full object-cover border"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            {companyName.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Name */}
        <div className="text-left hidden sm:block">
          <p className="text-sm font-semibold text-gray-900 leading-none">
            {companyName}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {userRole}
          </p>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ================= DROPDOWN ================= */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">
              {companyName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {email}
            </p>
          </div>

          {/* Actions */}
          <div className="py-2">
            <button
              onClick={handleProfileNavigate}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <User className="h-4 w-4 text-gray-500" />
              View Profile
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

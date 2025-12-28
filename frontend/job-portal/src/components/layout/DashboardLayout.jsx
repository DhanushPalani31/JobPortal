import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Building2,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { NAVIGATION_MENU } from "../../pages/utils/data";
import ProfileDropdown from "./ProfileDropdown";

/* -------------------- Navigation Item -------------------- */
const NavigationItem = ({ item, isActive, onClick, isCollapsed }) => {
  const Icon = item.icon;

  return (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-50"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <Icon
        className={`h-5 w-5 flex-shrink-0 ${
          isActive ? "text-blue-600" : "text-gray-500"
        }`}
      />
      {!isCollapsed && (
        <span className="ml-3 truncate">{item.name}</span>
      )}
    </button>
  );
};

/* -------------------- Dashboard Layout -------------------- */
const DashboardLayout = ({ activeMenu = "dashboard", children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(activeMenu);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* -------------------- Responsive Handler -------------------- */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* -------------------- Close Profile Dropdown -------------------- */
  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen]);

  /* -------------------- Handlers -------------------- */
  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
    navigate(`/${itemId}`);
    if (isMobile) setSidebarOpen(false);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const sidebarCollapsed = false; // ready for future collapse feature

  /* -------------------- JSX -------------------- */
  return (
    <div className="flex h-screen bg-gray-50">
      {/* ==================== SIDEBAR ==================== */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300
        ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        }
        ${sidebarCollapsed ? "w-16" : "w-64"}
        bg-white border-r border-gray-200`}
      >
        {/* Logo */}
        <div className="flex items-center h-16 border-b border-gray-200 pl-6">
          {!sidebarCollapsed ? (
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                JobPortal
              </span>
            </Link>
          ) : (
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="px-2 py-4 space-y-1">
          {NAVIGATION_MENU.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={activeNavItem === item.id}
              onClick={handleNavigation}
              isCollapsed={sidebarCollapsed}
            />
          ))}
        </div>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            <LogOut className="h-5 w-5 text-gray-500" />
            {!sidebarCollapsed && (
              <span className="ml-3">Logout</span>
            )}
          </button>
        </div>
      </div>

      {/* ==================== MOBILE OVERLAY ==================== */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ==================== MAIN CONTENT ==================== */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300
        ${isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"}`}
      >
        {/* Top Navbar */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5 text-gray-600" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600" />
                )}
              </button>
            )}

            <div>
              <h1 className="text-base font-semibold text-gray-900">
                Welcome back!
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                Here's what's happening with your jobs today.
              </p>
            </div>
          </div>

          {/* Profile */}
          <ProfileDropdown
            isOpen={profileDropdownOpen}
            onToggle={(e) => {
              e.stopPropagation();
              setProfileDropdownOpen(!profileDropdownOpen);
            }}
            avatar={user?.avatar || ""}
            companyName={user?.name || ""}
            email={user?.email || ""}
            onLogout={logout}
          />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

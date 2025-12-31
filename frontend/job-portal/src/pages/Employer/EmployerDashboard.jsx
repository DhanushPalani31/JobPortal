import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Users,
  CheckCircle2,
  TrendingUp,
  Plus,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/layout/LoadingSpinner";
import JobDashboardCard from "../../components/Cards/JobDashboardCard";
import ApplicantDashboardCard from "../../components/Cards/ApplicantDashboardCard";

/* ================= CARD ================= */
const Card = ({ title, headerAction, subtitle, className = "", children }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {headerAction}
        </div>
      )}

      <div className={title ? "px-6 pb-6" : "p-6"}>{children}</div>
    </div>
  );
};

/* ================= STAT CARD ================= */
const StatCard = ({
  title,
  value,
  icon: Icon,
  trend = false,
  trendValue = 0,
  color = "blue",
}) => {
  const bgMap = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    purple: "from-violet-500 to-violet-600",
  };

  return (
    <Card className={`bg-gradient-to-br ${bgMap[color]} text-white border-0`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>

          {trend && (
            <div className="flex items-center mt-2 text-sm text-white/90">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>{trendValue}%</span>
            </div>
          )}
        </div>

        <div className="bg-white/15 p-3 rounded-xl">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};

/* ================= DASHBOARD ================= */
const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getDashboardOverView = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);

      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDashboardOverView();
  }, []);

  return (
    <DashboardLayout activeMenu="employer-dashboard">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-7xl mx-auto space-y-8">
          {/* ================= STATS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Active Jobs"
              value={dashboardData?.counts?.totalActiveJobs || 0}
              icon={Briefcase}
              trend
              trendValue={dashboardData?.counts?.trends?.activeJobs || 0}
              color="blue"
            />

            <StatCard
              title="Total Applicants"
              value={dashboardData?.counts?.totalApplicants || 0}
              icon={Users}
              trend
              trendValue={dashboardData?.counts?.trends?.applicants || 0}
              color="green"
            />

            <StatCard
              title="Jobs Closed"
              value={dashboardData?.counts?.closedJobs || 0}
              icon={CheckCircle2}
              color="purple"
            />
          </div>

          {/* ================= RECENT JOBS ================= */}
          <Card
            title="Recent Job Posts"
            subtitle="Your latest job postings"
            headerAction={
              <button
                onClick={() => navigate("/manage-jobs")}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View all
              </button>
            }
          >
            {dashboardData?.data?.recentJobs?.length ? (
              <div className="space-y-3">
                {dashboardData.data.recentJobs.slice(0, 3).map((job) => (
                  <JobDashboardCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No recent job posts found.
              </p>
            )}
          </Card>

          {/* ================= RECENT APPLICATIONS ================= */}
          <Card
            title="Recent Applications"
            subtitle="Latest candidates who applied"
            headerAction={
              <button
                onClick={() => navigate("/all-applications")}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View all
              </button>
            }
          >
            {dashboardData?.data?.recentApplications?.length ? (
              <div className="space-y-3">
                {dashboardData.data.recentApplications
                  .slice(0, 4)
                  .map((application) => (
                    <ApplicantDashboardCard
                      key={application._id}
                      application={application}
                    />
                  ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No recent applications found.
              </p>
            )}
          </Card>

          {/* ================= QUICK ACTIONS ================= */}
          <Card
            title="Quick Actions"
            subtitle="Common tasks to get you started"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Post New Job",
                  icon: Plus,
                  color: "bg-blue-50 text-blue-700",
                  path: "/post-job",
                },
                {
                  title: "Review Applications",
                  icon: Users,
                  color: "bg-green-50 text-green-700",
                  path: "/applications",
                },
                {
                  title: "Company Settings",
                  icon: Building2,
                  color: "bg-orange-50 text-orange-700",
                  path: "/company-profile",
                },
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="flex items-center space-x-3 p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition"
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-gray-900">
                    {action.title}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmployerDashboard;

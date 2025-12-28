import React from "react";
import moment from "moment";
import { User, Briefcase } from "lucide-react";

const ApplicantDashboardCard = ({ application }) => {
  if (!application) return null;

  const { applicant, job, status, createdAt } = application;

  const statusStyles = {
    Applied: "bg-blue-100 text-blue-700",
    "In Review": "bg-yellow-100 text-yellow-700",
    Accepted: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <User className="h-5 w-5 text-indigo-600" />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900">
            {applicant?.name || "Applicant"}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {job?.title || "Job"}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="text-right">
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            statusStyles[status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {status}
        </span>
        <p className="text-xs text-gray-500 mt-1">
          {moment(createdAt).fromNow()}
        </p>
      </div>
    </div>
  );
};

export default ApplicantDashboardCard;

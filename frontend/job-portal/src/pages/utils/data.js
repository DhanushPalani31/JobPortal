import {
  Search,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Shield,
  Clock,
  Award,
  Briefcase,
  Building2,
  LayoutDashboard,
  Plus,
} from "lucide-react";

export const jobSeekerFeatures = [
  {
    icon: Search,
    title: "Smart Job Matching",
    description:
      "AI-powered matching recommends the most suitable job opportunities based on your skills, profile, and career goals.",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description:
      "Generate a professional resume instantly using expert-approved templates and intelligent content suggestions.",
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    description:
      "Chat directly with recruiters and hiring managers through a secure, built-in messaging system.",
  },
  {
    icon: Award,
    title: "Skill Assessment",
    description:
      "Complete quick skill tests to highlight your strengths and boost your visibility to employers.",
  },
];

export const employerFeatures = [
  {
    icon: Users,
    title: "Talent Pool Access",
    description:
      "Browse and filter a large pool of pre-qualified candidates to find the perfect match for your open roles.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Access real-time hiring insights including job views, applications, engagement metrics, and candidate performance.",
  },
  {
    icon: Shield,
    title: "Verified Candidates",
    description:
      "Hire confidently with candidates who have verified identities, skills, and background details.",
  },
  {
    icon: Clock,
    title: "Quick Hiring",
    description:
      "Speed up your recruitment process with instant alerts, smart shortlisting, and automated communication tools.",
  },
];


export const NAVIGATION_MENU = [
  { id: "employer-dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "post-job", name: "Post Job", icon: Plus },
  { id: "manage-jobs", name: "Manage Jobs", icon: Plus },
  { id: "company-profile", name: "Company Profile", icon: Building2 },
];

export const CATEGORIES = [
  { value: "Engineering", label: "Engineering" },
  { value: "Design", label: "Design" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
  { value: "IT & Software", label: "IT & Software" },
  { value: "Customer-service", label: "Customer-Service" },
  { value: "Product", label: "Product" },
  { value: "Operations", label: "Operations" },
  { value: "Finance", label: "Finance" },
  { value: "HR", label: "Human Resources" },
  { value: "Other", label: "Other" },
];

export const JOB_TYPES = [
  { value: "Remote", label: "Remote" },
  { value: "Full-Time", label: "Full-Time" },
  { value: "Part-Time", label: "Part-Time" },
  { value: "Contract", label: "Contract" },
  { value: "Intership", label: "Intership" },
];

export const SALARY_RANGES=[
    "Less than $1000",
    "$1000-$15,000",
    "More than $15,000",
]

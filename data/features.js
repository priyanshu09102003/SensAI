import { BrainCircuit, Briefcase, CalendarClock, LineChart, Rocket, ScrollText } from "lucide-react";

export const features = [
  {
    icon: <BrainCircuit className="w-10 h-10 mb-4 text-primary" />,
    title: "AI-Powered Career Guidance",
    description:
      "Get personalized career advice and insights powered by advanced AI technology.",
  },
  {
    icon: <Briefcase className="w-10 h-10 mb-4 text-primary" />,
    title: "Interview Preparation",
    description:
      "Practice with tailored, role-specific questions and receive instant, actionable feedback to enhance your performance."
  },
  {
    icon: <LineChart className="w-10 h-10 mb-4 text-primary" />,
    title: "Industry Insights",
    description:
      "Real-time Insights, Salary trends, in-demand skills , All updated weekly - powered by an intuitve graph analytics.",
  },
  {
    icon: <ScrollText className="w-10 h-10 mb-4 text-primary" />,
    title: "Tailored Resumes",
    description:
      "AI-powered ATS-optimized resumes - customizable, downloadable and publishable at your convenience.",
  },

  {
    icon: <Rocket className="w-10 h-10 mb-4 text-primary" />,
    title: "Interview Simulator",
    description: "Experience fully personalized mock interviews with our AI voice agent — a lifelike interviewer that poses questions like a seasoned HR professional and delivers instant, actionable feedback after every session."
  },
  {
    icon: <CalendarClock className="w-10 h-10 mb-4 text-primary" />,
    title: "Smart Scheduler",
    description: "Simplify your workflow with effortless meeting scheduling — clear invites, conflict-free timing, and seamless calendar integration."
  },
];

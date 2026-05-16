import { Calendar, BellRing, Megaphone, Users } from 'lucide-react';

export const stats = [
  { title: "My Events", value: 24, icon: Calendar, color: "bg-blue-100/50 text-blue-600" },
  { title: "My Announcements", value: 5, icon: Megaphone, color: "bg-pink-100/50 text-pink-600" },
  { title: "Notifications", value: 18, icon: BellRing, color: "bg-green-100/50 text-green-600" },
  { title: "# of Attendees/Joined", value: 250, icon: Users, color: "bg-red-100/50 text-red-600" },
];

export const pendingApprovals = [
  { title: "Hackathon", organization: "CCS Officials", date: "Oct 29, 2025" },
  { title: "Tekken Tournament", organization: "CCS Student Council", date: "Oct 29, 2025" },
  { title: "Dev fest", organization: "CCS Officials", date: "Oct 28, 2025" },
];

export const recentActivity = [
  { title: "Capstone Defense Schedule", status: "APPROVED", statusColor: "text-green-600 bg-green-50" },
  { title: "Valorant Tournament", status: "REJECTED", statusColor: "text-red-600 bg-red-50" },
  { title: "Tech Fest", status: "PENDING", statusColor: "text-yellow-600 bg-yellow-50" },
];

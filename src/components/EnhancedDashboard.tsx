// EnhancedDashboard.tsx - Enhanced Version
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

interface EnhancedDashboardProps {
  employee: Doc<"employees">;
}

export function EnhancedDashboard({ employee }: EnhancedDashboardProps) {
  const dashboardData = useQuery(api.realtime.getDashboardSummary);
  const teamData = useQuery(api.realtime.getTeamSummary);

  if (!dashboardData || !teamData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const { attendance, upcomingHolidays, teamOnLeaveCount, remoteWorkCount, announcements } = dashboardData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Attendance Summary */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Today's Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
              <p className="font-semibold text-gray-900 dark:text-white">{attendance.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Check In</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {attendance.checkIn ? new Date(attendance.checkIn).toLocaleTimeString() : "--:--"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Work Hours</p>
              <p className="font-semibold text-gray-900 dark:text-white">{attendance.workHours.toFixed(1)}h</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Location</p>
              <p className="font-semibold text-gray-900 dark:text-white capitalize">{attendance.workLocation}</p>
            </div>
          </div>
        </div>

        {/* Team Overview */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Team Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{teamData.stats.total}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Team</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{teamData.stats.present}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Present</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">{teamData.stats.onLeave}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">On Leave</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{teamData.stats.wfh}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">WFH</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Upcoming Holidays */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Upcoming Holidays</h3>
          <ul className="space-y-3">
            {upcomingHolidays.map((holiday) => (
              <li key={holiday._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <span className="font-medium text-gray-900 dark:text-white">{holiday.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(holiday.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Announcements */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Announcements</h3>
          <ul className="space-y-4">
            {announcements.map((announcement) => (
              <li key={announcement._id} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">{announcement.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{announcement.content}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

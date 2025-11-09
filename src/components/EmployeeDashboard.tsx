// EmployeeDashboard.tsx - Enhanced Version
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { toast } from "react-hot-toast";

interface EmployeeDashboardProps {
  employee: Doc<"employees"> | null;
}

export function EmployeeDashboard({ employee }: EmployeeDashboardProps) {
  if (!employee) {
    return <div className="text-gray-900 dark:text-white">Loading...</div>;
  }
  const attendanceStats = null;
  const todayAttendance = useQuery(api.attendance.getTodayAttendance,
    employee ? { employeeId: employee._id } : "skip"
  );
  const leaveBalance = useQuery(api.leaves.getLeaveBalance,
    employee ? { employeeId: employee._id, year: new Date().getFullYear() } : "skip"
  );

  const clockIn = useMutation(api.attendance.clockIn);
  const clockOut = useMutation(api.attendance.clockOut);

  const handleClockIn = async () => {
    try {
      await clockIn({ employeeId: employee._id });
      toast.success("Clocked in successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleClockOut = async () => {
    try {
      await clockOut({ employeeId: employee._id });
      toast.success("Clocked out successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="md:col-span-2 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-2xl text-white shadow-2xl">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {employee.firstName}!</h1>
          <p className="text-blue-100">Here's your dashboard overview for today.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={handleClockIn} 
            disabled={!!todayAttendance?.checkIn} 
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 text-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none"
          >
            <span className="text-4xl mb-2 block">➡️</span>
            <p className="font-semibold text-gray-900 dark:text-white">Clock In</p>
          </button>
          <button 
            onClick={handleClockOut} 
            disabled={!todayAttendance?.checkIn || !!todayAttendance?.checkOut} 
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 text-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none"
          >
            <span className="text-4xl mb-2 block">⬅️</span>
            <p className="font-semibold text-gray-900 dark:text-white">Clock Out</p>
          </button>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 text-center cursor-pointer hover:shadow-xl transition-all transform hover:scale-105">
            <span className="text-4xl mb-2 block">📝</span>
            <p className="font-semibold text-gray-900 dark:text-white">Request Leave</p>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Leave Balance */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
          <h3 className="font-bold mb-4 text-gray-900 dark:text-white text-lg">Leave Balance</h3>
          {leaveBalance && leaveBalance.length > 0 ? (
            <div className="space-y-3">
              {leaveBalance.slice(0, 3).map((lb: any) => (
                <div key={lb.leaveType._id} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{lb.leaveType.name}</span>
                  <span className="font-bold text-green-600 dark:text-green-400">{lb.balance.balance} days</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No leave balance available</p>
          )}
        </div>

        {/* Attendance Stats */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
          <h3 className="font-bold mb-4 text-gray-900 dark:text-white text-lg">This Month's Attendance</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Avg. Hours/Day</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">8.0h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
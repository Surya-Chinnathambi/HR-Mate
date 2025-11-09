import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

interface AttendanceModuleProps {
  employee: Doc<"employees">;
}

export function AttendanceModule({ employee }: AttendanceModuleProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const clockIn = useMutation(api.attendance.clockIn);
  const clockOut = useMutation(api.attendance.clockOut);
  const todayAttendance = useQuery(api.attendance.getTodayAttendance,
    employee ? { employeeId: employee._id } : "skip"
  );
  const attendanceStats = null;

  const handleClockIn = async () => {
    if (!employee) return;
    try {
      await clockIn({ employeeId: employee._id });
    } catch (error) {
      console.error(error);
    }
  };

  const handleClockOut = async () => {
    if (!employee) return;
    try {
      await clockOut({ employeeId: employee._id });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Today's Attendance</h2>
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {todayAttendance?.status || "Not Clocked In"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 dark:text-gray-400">Clock In:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {todayAttendance?.checkIn ? new Date(todayAttendance.checkIn).toLocaleTimeString() : "--:--"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 dark:text-gray-400">Clock Out:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {todayAttendance?.checkOut ? new Date(todayAttendance.checkOut).toLocaleTimeString() : "--:--"}
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleClockIn} 
              disabled={!!todayAttendance?.checkIn} 
              className="px-6 py-3 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-xl disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              Clock In
            </button>
            <button 
              onClick={handleClockOut} 
              disabled={!todayAttendance?.checkIn || !!todayAttendance?.checkOut} 
              className="px-6 py-3 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-xl disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              Clock Out
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Monthly Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-2xl text-white shadow-lg">
            <p className="text-3xl font-bold">22</p>
            <p className="text-sm text-green-100 mt-1">Present</p>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-rose-500 p-6 rounded-2xl text-white shadow-lg">
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-red-100 mt-1">Absent</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-2xl text-white shadow-lg">
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-yellow-100 mt-1">Late</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-2xl text-white shadow-lg">
            <p className="text-3xl font-bold">8.0h</p>
            <p className="text-sm text-blue-100 mt-1">Avg. Hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}
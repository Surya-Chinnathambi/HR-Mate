import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { Users, CheckCircle, XCircle, Clock, Mail, Phone } from "lucide-react";

interface MyTeamModuleProps {
  employee: Doc<"employees">;
}

export function MyTeamModule({ employee }: MyTeamModuleProps) {
  const teamData = useQuery(api.realtime.getTeamSummary);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'Absent':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'On Leave':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present':
        return <CheckCircle className="w-4 h-4" />;
      case 'Absent':
        return <XCircle className="w-4 h-4" />;
      case 'On Leave':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const teamMembers = teamData?.team || [];
  const presentCount = teamMembers.filter(m => m.attendanceStatus === 'Present').length;
  const absentCount = teamMembers.filter(m => m.attendanceStatus === 'Absent').length;
  const onLeaveCount = teamMembers.filter(m => m.attendanceStatus === 'On Leave').length;

  return (
    <div className="space-y-6">
      {/* Team Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-6 rounded-2xl shadow-xl border border-blue-500 dark:border-blue-600">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-blue-100 text-sm font-semibold mb-1">Total Team</p>
          <p className="text-3xl font-bold text-white">{teamMembers.length}</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 p-6 rounded-2xl shadow-xl border border-green-500 dark:border-green-600">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-green-100 text-sm font-semibold mb-1">Present</p>
          <p className="text-3xl font-bold text-white">{presentCount}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-orange-700 dark:from-orange-700 dark:to-orange-800 p-6 rounded-2xl shadow-xl border border-orange-500 dark:border-orange-600">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-orange-100 text-sm font-semibold mb-1">On Leave</p>
          <p className="text-3xl font-bold text-white">{onLeaveCount}</p>
        </div>

        <div className="bg-gradient-to-br from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 p-6 rounded-2xl shadow-xl border border-red-500 dark:border-red-600">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-red-100 text-sm font-semibold mb-1">Absent</p>
          <p className="text-3xl font-bold text-white">{absentCount}</p>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Members</h2>
          <p className="text-gray-600 dark:text-gray-400">Your team's current status and information</p>
        </div>

        <div className="p-6">
          {teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map((member) => (
                <div 
                  key={member._id} 
                  className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 group"
                >
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-white text-lg font-bold">
                          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </span>
                      </div>
                      {/* Status indicator dot */}
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                        member.attendanceStatus === 'Present' ? 'bg-green-500' : 
                        member.attendanceStatus === 'Absent' ? 'bg-red-500' : 
                        'bg-orange-500'
                      }`}></div>
                    </div>

                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">
                        {member.firstName} {member.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {member.designation}
                      </p>
                      
                      {/* Status Badge */}
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(member.attendanceStatus)}`}>
                          {getStatusIcon(member.attendanceStatus)}
                          <span className="ml-1">{member.attendanceStatus}</span>
                        </span>
                      </div>

                      {/* Contact Actions */}
                      <div className="flex items-center space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Team Members</h3>
              <p className="text-gray-600 dark:text-gray-400">Your team information will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Team Performance Overview */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Team Performance</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Attendance Rate</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {teamMembers.length > 0 ? Math.round((presentCount / teamMembers.length) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${teamMembers.length > 0 ? (presentCount / teamMembers.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Team Availability</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {teamMembers.length > 0 ? Math.round(((presentCount + onLeaveCount) / teamMembers.length) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${teamMembers.length > 0 ? ((presentCount + onLeaveCount) / teamMembers.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
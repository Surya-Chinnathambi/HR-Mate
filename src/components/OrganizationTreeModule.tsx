import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Building2, Users, ChevronDown, ChevronRight, User } from 'lucide-react';
import { useState } from 'react';

export function OrganizationTreeModule() {
  const orgTree: { department: string; count: number; employees: any[] }[] = useQuery(api.employees.getOrganizationTree) || [];
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(orgTree.map(d => d.department)));

  const toggleDepartment = (dept: string) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(dept)) {
      newExpanded.delete(dept);
    } else {
      newExpanded.add(dept);
    }
    setExpandedDepts(newExpanded);
  };

  const totalEmployees = orgTree.reduce((sum, dept) => sum + dept.count, 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-6 rounded-2xl shadow-xl border border-blue-500 dark:border-blue-600">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-blue-100 text-sm font-semibold mb-1">Total Departments</p>
          <p className="text-3xl font-bold text-white">{orgTree.length}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 p-6 rounded-2xl shadow-xl border border-purple-500 dark:border-purple-600">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-purple-100 text-sm font-semibold mb-1">Total Employees</p>
          <p className="text-3xl font-bold text-white">{totalEmployees}</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 p-6 rounded-2xl shadow-xl border border-green-500 dark:border-green-600">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-green-100 text-sm font-semibold mb-1">Avg per Dept</p>
          <p className="text-3xl font-bold text-white">
            {orgTree.length > 0 ? Math.round(totalEmployees / orgTree.length) : 0}
          </p>
        </div>
      </div>

      {/* Organization Tree */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Organization Structure</h2>
          <p className="text-gray-600 dark:text-gray-400">Hierarchical view of departments and employees</p>
        </div>

        <div className="p-6">
          {orgTree.length > 0 ? (
            <div className="space-y-3">
              {orgTree.map((dept) => {
                const isExpanded = expandedDepts.has(dept.department);
                
                return (
                  <div key={dept.department} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-200">
                    {/* Department Header */}
                    <button
                      onClick={() => toggleDepartment(dept.department)}
                      className="w-full p-5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-md">
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                              {dept.department}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {dept.count} {dept.count === 1 ? 'employee' : 'employees'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full font-bold text-sm">
                            {dept.count}
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400 transition-transform" />
                          ) : (
                            <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400 transition-transform" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Employee List */}
                    {isExpanded && (
                      <div className="bg-white dark:bg-gray-800 p-4 animate-in slide-in-from-top-2 duration-200">
                        <div className="space-y-2">
                          {dept.employees.map((emp) => (
                            <div
                              key={emp._id}
                              className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-md transition-all duration-200 group"
                            >
                              {/* Avatar */}
                              <div className="relative flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                                  <span className="text-white font-bold">
                                    {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                                  </span>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                              </div>

                              {/* Employee Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 dark:text-white truncate">
                                  {emp.firstName} {emp.lastName}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                  {emp.designation}
                                </p>
                              </div>

                              {/* Employee ID Badge */}
                              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
                                  <p className="text-xs font-bold text-blue-800 dark:text-blue-400">
                                    ID: {emp.employeeId}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Organization Data</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Organization structure will appear here once data is available.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Department Distribution Chart */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Department Distribution</h3>
        <div className="space-y-3">
          {orgTree.map((dept, index) => {
            const percentage = totalEmployees > 0 ? (dept.count / totalEmployees) * 100 : 0;
            const colors = [
              'from-blue-500 to-blue-600',
              'from-purple-500 to-purple-600',
              'from-green-500 to-green-600',
              'from-orange-500 to-orange-600',
              'from-pink-500 to-pink-600',
              'from-indigo-500 to-indigo-600',
            ];
            const color = colors[index % colors.length];

            return (
              <div key={dept.department}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {dept.department}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {dept.count} ({Math.round(percentage)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`bg-gradient-to-r ${color} h-3 rounded-full transition-all duration-500 shadow-md`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
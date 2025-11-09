import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Users, Search, Filter, Mail, Phone, MapPin, Building2 } from "lucide-react";

export function OrganizationDirectory() {
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const orgData = useQuery(api.realtime.getEmployeeDirectory, filters);

  const employees = orgData?.employees || [];
  const departments = orgData?.filters.departments || [];
  const locations = orgData?.filters.locations || [];

  const filteredEmployees = employees.filter(employee => {
    const searchLower = searchTerm.toLowerCase();
    return (
      employee.firstName.toLowerCase().includes(searchLower) ||
      employee.lastName.toLowerCase().includes(searchLower) ||
      employee.designation.toLowerCase().includes(searchLower) ||
      employee.department.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-6 rounded-2xl shadow-xl border border-blue-500 dark:border-blue-600">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-blue-100 text-sm font-semibold mb-1">Total Employees</p>
          <p className="text-3xl font-bold text-white">{employees.length}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 p-6 rounded-2xl shadow-xl border border-purple-500 dark:border-purple-600">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-purple-100 text-sm font-semibold mb-1">Departments</p>
          <p className="text-3xl font-bold text-white">{departments.length}</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 p-6 rounded-2xl shadow-xl border border-green-500 dark:border-green-600">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <MapPin className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-green-100 text-sm font-semibold mb-1">Locations</p>
          <p className="text-3xl font-bold text-white">{locations.length}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-orange-700 dark:from-orange-700 dark:to-orange-800 p-6 rounded-2xl shadow-xl border border-orange-500 dark:border-orange-600">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-orange-100 text-sm font-semibold mb-1">Active</p>
          <p className="text-3xl font-bold text-white">{employees.length}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees by name, designation, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white min-w-[150px]"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <select
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white min-w-[150px]"
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employee Directory Grid */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Employee Directory</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredEmployees.length} {filteredEmployees.length === 1 ? 'employee' : 'employees'} found
          </p>
        </div>

        <div className="p-6">
          {filteredEmployees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((employee) => (
                <div 
                  key={employee._id} 
                  className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 group"
                >
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-white text-xl font-bold">
                          {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>

                    {/* Employee Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate font-semibold">
                        {employee.designation}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500">
                          <Building2 className="w-3 h-3" />
                          <span className="truncate">{employee.department}</span>
                        </div>
                        {employee.location && (
                          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{employee.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Contact Actions */}
                      <div className="flex items-center space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="flex-1 p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all flex items-center justify-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span className="text-xs font-semibold">Email</span>
                        </button>
                        <button className="flex-1 p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all flex items-center justify-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span className="text-xs font-semibold">Call</span>
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Employees Found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search criteria' : 'No employees in the directory'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
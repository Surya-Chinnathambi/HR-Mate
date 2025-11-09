import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignOutButton } from "../SignOutButton";
import { EmployeeDashboard } from "./EmployeeDashboard";
import { AttendanceModule } from "./AttendanceModule";
import { LeaveModule } from "./LeaveModule";
import { PayrollModule } from "./PayrollModule";
import { AICommandCenter } from "./AICommandCenter";
import { NotificationInbox } from "./NotificationInbox";

type ActiveModule = "dashboard" | "attendance" | "leave" | "payroll" | "profile" | "reports";

export function HRMSDashboard() {
  const [activeModule, setActiveModule] = useState<ActiveModule>("dashboard");
  const [showAIChat, setShowAIChat] = useState(false);
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const currentEmployee = useQuery(api.employees.getCurrentEmployee);
  const createEmployee = useMutation(api.employeeSetup.createCurrentEmployee);

  // Auto-create employee record if it doesn't exist
  useEffect(() => {
    if (loggedInUser && !currentEmployee) {
      createEmployee();
    }
  }, [loggedInUser, currentEmployee, createEmployee]);

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "attendance", label: "Attendance", icon: "⏰" },
    { id: "leave", label: "Leave", icon: "🏖️" },
    { id: "payroll", label: "Payroll", icon: "💰" },
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "reports", label: "Reports", icon: "📊" },
  ];

  const renderActiveModule = () => {
    if (!currentEmployee) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Setting up your employee profile...</p>
          </div>
        </div>
      );
    }

    switch (activeModule) {
      case "dashboard":
        return <EmployeeDashboard employee={currentEmployee} />;
      case "attendance":
        return <AttendanceModule employee={currentEmployee} />;
      case "leave":
        return <LeaveModule />;
      case "payroll":
        return <PayrollModule employee={currentEmployee} />;
      default:
        return <EmployeeDashboard employee={currentEmployee} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HRMS Portal
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationInbox />
              <button
                onClick={() => setShowAIChat(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>🤖</span>
                <span className="font-medium">AI Assistant</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">GPT-5</span>
              </button>
              <div className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200/50">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {currentEmployee?.firstName?.charAt(0) || loggedInUser?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {currentEmployee?.firstName || loggedInUser?.email?.split('@')[0] || 'User'}
                </span>
                <SignOutButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white/60 backdrop-blur-md shadow-xl min-h-screen border-r border-gray-200/50">
          <div className="p-6">
            <ul className="space-y-3">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveModule(item.id as ActiveModule)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeModule === item.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                        : "text-gray-700 hover:bg-white/70 hover:shadow-md hover:transform hover:scale-102"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveModule()}
          </div>
        </main>
      </div>

      {/* AI Command Center */}
      {showAIChat && currentEmployee && (
        <AICommandCenter 
          onClose={() => setShowAIChat(false)} 
          employee={currentEmployee} 
        />
      )}
    </div>
  );
}

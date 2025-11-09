import { useState, useRef, useEffect } from "react";
import { Doc } from "../../convex/_generated/dataModel";
import { User, Lock, LogOut, Palette, Moon, Sun, ChevronDown } from "lucide-react";

interface UserMenuProps {
  employee: Doc<"employees">;
  onViewProfile: () => void;
  onChangePassword: () => void;
  onThemePicker: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function UserMenu({ 
  employee, 
  onViewProfile, 
  onChangePassword, 
  onThemePicker, 
  onLogout,
  isDarkMode,
  onToggleDarkMode 
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    {
      icon: <User className="w-5 h-5" />,
      label: "View Profile",
      onClick: () => {
        onViewProfile();
        setIsOpen(false);
      }
    },
    {
      icon: <Lock className="w-5 h-5" />,
      label: "Change Password",
      onClick: () => {
        onChangePassword();
        setIsOpen(false);
      }
    },
    {
      icon: <Palette className="w-5 h-5" />,
      label: "Color Theme",
      onClick: () => {
        onThemePicker();
        setIsOpen(false);
      }
    },
    {
      icon: isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />,
      label: isDarkMode ? "Light Mode" : "Dark Mode",
      onClick: () => {
        onToggleDarkMode();
        setIsOpen(false);
      }
    },
    {
      icon: <LogOut className="w-5 h-5" />,
      label: "Logout",
      onClick: () => {
        onLogout();
        setIsOpen(false);
      },
      danger: true
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* User Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-xl border border-gray-200 dark:border-gray-700"
      >
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-lg">
            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
          </span>
        </div>
        <div className="hidden md:block text-left">
          <p className="font-bold text-gray-900 dark:text-white text-sm">
            {employee.firstName} {employee.lastName}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">{employee.designation}</p>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 top-full mt-2 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
            {/* User Info Header */}
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-blue-600 font-bold text-xl">
                    {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">
                    {employee.firstName} {employee.lastName}
                  </p>
                  <p className="text-sm text-blue-100 truncate">{employee.designation}</p>
                  <p className="text-xs text-blue-200 truncate">{employee.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`w-full flex items-center space-x-3 px-5 py-3 text-left transition-all duration-200 ${
                    item.danger 
                      ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className={`${item.danger ? '' : 'text-gray-400'}`}>
                    {item.icon}
                  </div>
                  <span className="font-semibold">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Employee ID: <span className="font-bold text-gray-700 dark:text-gray-300">{employee.employeeId}</span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
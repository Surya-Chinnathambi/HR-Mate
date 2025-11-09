import { useState } from "react";
import { Bell, CheckCheck, Trash2, X } from "lucide-react";

export function NotificationInbox() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Leave Request Approved",
      message: "Your casual leave request for Dec 20-21 has been approved.",
      type: "success",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Payroll Generated",
      message: "Your payslip for November 2024 is now available.",
      type: "info",
      timestamp: "1 day ago",
      read: false,
    },
    {
      id: 3,
      title: "Training Reminder",
      message: "Leadership Skills training starts tomorrow at 10 AM.",
      type: "warning",
      timestamp: "2 days ago",
      read: true,
    },
    {
      id: 4,
      title: "Policy Update",
      message: "Work from home policy has been updated. Please review.",
      type: "info",
      timestamp: "3 days ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20";
      case "warning":
        return "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20";
      case "error":
        return "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20";
      default:
        return "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          />

          {/* Notification Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 z-50 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-lg">Notifications</h3>
                  <p className="text-sm text-blue-100">{unreadCount} unread messages</p>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[32rem] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group ${
                      !notification.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className={`p-3 rounded-xl border ${getNotificationColor(notification.type)} flex-shrink-0`}>
                        <span className="text-xl">
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-gray-400 dark:text-gray-500 text-xs">
                            {notification.timestamp}
                          </p>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <span className="text-6xl mb-4 block">🔭</span>
                  <p className="text-gray-500 dark:text-gray-400 font-semibold">No notifications</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">You're all caught up!</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                <button 
                  onClick={markAllAsRead}
                  className="w-full flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-semibold transition-colors py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Mark all as read</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
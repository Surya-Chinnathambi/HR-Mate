import { Doc } from "../../convex/_generated/dataModel";

interface AppsModuleProps {
  employee: Doc<"employees">;
}

export function AppsModule({ employee }: AppsModuleProps) {
  const apps = [
    {
      id: 1,
      name: "Time Tracker",
      description: "Track your work hours and productivity",
      icon: "⏰",
      category: "Productivity",
      status: "Available"
    },
    {
      id: 2,
      name: "Document Manager",
      description: "Manage and share documents securely",
      icon: "📁",
      category: "Productivity",
      status: "Available"
    },
    {
      id: 3,
      name: "Team Chat",
      description: "Communicate with your team members",
      icon: "💬",
      category: "Communication",
      status: "Available"
    },
    {
      id: 4,
      name: "Calendar Sync",
      description: "Sync your calendar across devices",
      icon: "📅",
      category: "Productivity",
      status: "Coming Soon"
    },
    {
      id: 5,
      name: "Learning Hub",
      description: "Access training materials and courses",
      icon: "📚",
      category: "Learning",
      status: "Available"
    },
    {
      id: 6,
      name: "Wellness Tracker",
      description: "Monitor your health and wellness goals",
      icon: "🏃‍♂️",
      category: "Health",
      status: "Coming Soon"
    }
  ];

  const categories = [...new Set(apps.map(app => app.category))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Apps</h2>
        <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 font-medium">
          Request App
        </button>
      </div>

      {/* App Categories */}
      {categories.map(category => (
        <div key={category} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{category}</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {apps.filter(app => app.category === category).map(app => (
                <div key={app.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl">{app.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{app.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          app.status === 'Available' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{app.description}</p>
                      <button 
                        className={`w-full py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                          app.status === 'Available'
                            ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={app.status !== 'Available'}
                      >
                        {app.status === 'Available' ? 'Launch App' : 'Coming Soon'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <span className="mr-2">⚡</span>
            Quick Actions
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-900">
              <span className="text-3xl mb-2">📊</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Reports</span>
            </button>
            <button className="flex flex-col items-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-900">
              <span className="text-3xl mb-2">🔧</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Settings</span>
            </button>
            <button className="flex flex-col items-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-900">
              <span className="text-3xl mb-2">📱</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Mobile App</span>
            </button>
            <button className="flex flex-col items-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-900">
              <span className="text-3xl mb-2">❓</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Help</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Doc } from "../../convex/_generated/dataModel";
import { Target, MessageSquare, Star, TrendingUp, Plus } from "lucide-react";

interface PerformanceModuleProps {
  employee: Doc<"employees">;
  activeTab?: "goals" | "feedback" | "reviews";
}

export function PerformanceModule({ employee, activeTab = "goals" }: PerformanceModuleProps) {
  const [currentTab, setCurrentTab] = useState<"goals" | "feedback" | "reviews">(activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Performance</h2>
          <p className="text-gray-600 dark:text-gray-400">Track your goals, feedback, and reviews</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
          <Plus className="w-5 h-5" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
        <div className="flex border-b border-gray-200 dark:border-gray-800 p-2">
          <button
            onClick={() => setCurrentTab("goals")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex-1 ${
              currentTab === "goals"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Target className="w-5 h-5" />
            <span>My Goals</span>
          </button>
          <button
            onClick={() => setCurrentTab("feedback")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex-1 ${
              currentTab === "feedback"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Feedback</span>
          </button>
          <button
            onClick={() => setCurrentTab("reviews")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex-1 ${
              currentTab === "reviews"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Star className="w-5 h-5" />
            <span>Reviews</span>
          </button>
        </div>

        <div className="p-6">
          {currentTab === "goals" && (
            <div className="space-y-6">
              {/* Goals Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-semibold">Completed Goals</p>
                      <p className="text-4xl font-bold mt-2">3</p>
                    </div>
                    <div className="w-16 h-16 bg-green-400 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-green-800 text-3xl">✅</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-semibold">In Progress</p>
                      <p className="text-4xl font-bold mt-2">2</p>
                    </div>
                    <div className="w-16 h-16 bg-blue-400 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-blue-800 text-3xl">🔄</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-semibold">Pending</p>
                      <p className="text-4xl font-bold mt-2">1</p>
                    </div>
                    <div className="w-16 h-16 bg-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-orange-800 text-3xl">⏳</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Goals */}
              <div className="space-y-4">
                <div className="border border-green-200 dark:border-green-800 rounded-2xl p-6 bg-green-50 dark:bg-green-900/20 hover:shadow-lg transition-all duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white">Complete React Certification</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Q4 2024 • Professional Development</p>
                    </div>
                    <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 px-4 py-2 rounded-full text-xs font-bold border border-green-300 dark:border-green-700">
                      Completed
                    </span>
                  </div>
                  <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-3 mb-3 shadow-inner">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-md" style={{ width: '100%' }}></div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    Successfully completed the advanced React certification course and applied learnings to current projects.
                  </p>
                </div>

                <div className="border border-blue-200 dark:border-blue-800 rounded-2xl p-6 bg-blue-50 dark:bg-blue-900/20 hover:shadow-lg transition-all duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white">Improve Team Collaboration</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Q4 2024 • Leadership</p>
                    </div>
                    <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400 px-4 py-2 rounded-full text-xs font-bold border border-blue-300 dark:border-blue-700">
                      In Progress
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3 mb-3 shadow-inner">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-md" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    Implementing weekly team sync meetings and cross-functional collaboration initiatives.
                  </p>
                </div>

                <div className="border border-orange-200 dark:border-orange-800 rounded-2xl p-6 bg-orange-50 dark:bg-orange-900/20 hover:shadow-lg transition-all duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white">Launch New Product Feature</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Q1 2025 • Project Delivery</p>
                    </div>
                    <span className="bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-400 px-4 py-2 rounded-full text-xs font-bold border border-orange-300 dark:border-orange-700">
                      Pending
                    </span>
                  </div>
                  <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-3 mb-3 shadow-inner">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full shadow-md" style={{ width: '25%' }}></div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    Lead the development and launch of the new analytics dashboard feature.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentTab === "feedback" && (
            <div className="space-y-6">
              {/* Feedback Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span>Recent Feedback</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <span className="text-2xl">👍</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Excellent problem-solving skills</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <span className="text-2xl">💡</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Great innovative thinking</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <span className="text-2xl">🤝</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Strong team collaboration</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <Target className="w-5 h-5 text-orange-500" />
                    <span>Areas for Growth</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                      <span className="text-2xl">📈</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Public speaking confidence</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                      <span className="text-2xl">⏰</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Time management optimization</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback History */}
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-bold">MG</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Manager Feedback</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">2 weeks ago</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                    Outstanding work on the recent project delivery. Your technical expertise and attention to detail 
                    ensured we met all client requirements ahead of schedule.
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                      Technical Skills
                    </span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                      Project Management
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === "reviews" && (
            <div className="space-y-6">
              {/* Review Summary */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white mb-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-3">Overall Performance Rating</h3>
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-yellow-300 text-2xl">⭐</span>
                        ))}
                      </div>
                      <span className="text-3xl font-bold">4.5/5</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-100 text-sm font-semibold">Last Review</p>
                    <p className="text-2xl font-bold mt-1">Q3 2024</p>
                  </div>
                </div>
              </div>

              {/* Review History */}
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-800 shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white">Q3 2024 Performance Review</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Reviewed by: Manager • September 2024</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-xl ${star <= 4 ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>⭐</span>
                      ))}
                      <span className="ml-2 font-bold text-lg text-gray-900 dark:text-white">4.5</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h5 className="font-bold text-gray-900 dark:text-white mb-3">Strengths</h5>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                        <li className="flex items-start space-x-2">
                          <span className="text-green-500">•</span>
                          <span>Excellent technical problem-solving</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-500">•</span>
                          <span>Strong team collaboration</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-500">•</span>
                          <span>Consistent delivery quality</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-500">•</span>
                          <span>Proactive communication</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900 dark:text-white mb-3">Development Areas</h5>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                        <li className="flex items-start space-x-2">
                          <span className="text-orange-500">•</span>
                          <span>Leadership opportunities</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-orange-500">•</span>
                          <span>Cross-functional collaboration</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-orange-500">•</span>
                          <span>Strategic thinking</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                    <h5 className="font-bold text-gray-900 dark:text-white mb-2">Manager Comments</h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Exceptional performance this quarter. Consistently delivers high-quality work and has become 
                      a reliable team member. Looking forward to seeing continued growth in leadership areas.
                    </p>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-gray-50 dark:bg-gray-800/50 shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white">Q2 2024 Performance Review</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Reviewed by: Manager • June 2024</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4].map((star) => (
                        <span key={star} className="text-xl text-yellow-400">⭐</span>
                      ))}
                      <span className="text-xl text-gray-300 dark:text-gray-600">⭐</span>
                      <span className="ml-2 font-bold text-lg text-gray-900 dark:text-white">4.0</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Solid performance with notable improvements in project delivery and team communication.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
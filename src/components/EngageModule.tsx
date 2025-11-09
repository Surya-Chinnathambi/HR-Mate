import { useState } from "react";
import { Doc } from "../../convex/_generated/dataModel";
import { MessageSquare, BarChart3, ThumbsUp, Plus, Heart, MessageCircle, Share2, Award } from "lucide-react";

interface EngageModuleProps {
  employee: Doc<"employees">;
  activeTab?: "posts" | "polls" | "praise";
}

export function EngageModule({ employee, activeTab = "posts" }: EngageModuleProps) {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const renderTabContent = () => {
    switch (currentTab) {
      case "posts":
        return (
          <div className="space-y-4">
            {/* Sample Posts */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">HR</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">HR Team</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                🎉 Exciting news! We're launching a new employee wellness program starting next month. 
                Stay tuned for more details about fitness challenges, mental health resources, and team activities!
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <button className="flex items-center space-x-2 hover:text-red-600 dark:hover:text-red-400 transition-colors group">
                  <Heart className="w-5 h-5 group-hover:fill-current" />
                  <span className="font-semibold">12 Likes</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-semibold">3 Comments</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="font-semibold">Share</span>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">JS</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">John Smith</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">1 day ago</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Just completed the React certification course! 🚀 Thanks to the company's learning budget. 
                Excited to apply these new skills to our upcoming projects.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <button className="flex items-center space-x-2 hover:text-red-600 dark:hover:text-red-400 transition-colors group">
                  <Heart className="w-5 h-5 group-hover:fill-current" />
                  <span className="font-semibold">8 Likes</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-semibold">5 Comments</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="font-semibold">Share</span>
                </button>
              </div>
            </div>
          </div>
        );

      case "polls":
        return (
          <div className="space-y-4">
            {/* Sample Poll */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">HR</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">HR Team</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">3 hours ago</p>
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                What type of team building activity would you prefer for our next company event?
              </h3>
              <div className="space-y-3 mb-4">
                <div className="relative">
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">🎳 Bowling</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">45% (18 votes)</span>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors cursor-pointer">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">🏞️ Outdoor Adventure</span>
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">30% (12 votes)</span>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors cursor-pointer">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">🍕 Cooking Class</span>
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">25% (10 votes)</span>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
                Submit Vote
              </button>
            </div>
          </div>
        );

      case "praise":
        return (
          <div className="space-y-4">
            {/* Sample Praise */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">SJ</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">praised <span className="font-semibold text-gray-900 dark:text-white">John Smith</span> • 2 hours ago</p>
                </div>
                <Award className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                👏 Huge shoutout to John for his amazing work on the new dashboard! 
                His attention to detail and user-focused approach made all the difference. 
                The client feedback has been overwhelmingly positive! 🌟
              </p>
              <div className="flex items-center space-x-2">
                <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-bold border border-yellow-300 dark:border-yellow-700">
                  Teamwork
                </span>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-300 dark:border-blue-700">
                  Innovation
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">MD</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white">Mike Davis</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">praised <span className="font-semibold text-gray-900 dark:text-white">Sarah Johnson</span> • 1 day ago</p>
                </div>
                <Award className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                🎯 Sarah's presentation to the stakeholders was absolutely brilliant! 
                She clearly communicated complex technical concepts and secured buy-in for our new initiative. 
                Outstanding work! 💪
              </p>
              <div className="flex items-center space-x-2">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-300 dark:border-green-700">
                  Leadership
                </span>
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-bold border border-purple-300 dark:border-purple-700">
                  Communication
                </span>
              </div>
            </div>

            <div className="text-center py-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl">
              <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 flex items-center space-x-3 mx-auto shadow-lg hover:shadow-xl font-semibold">
                <Award className="w-6 h-6" />
                <span>Give Praise</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Engage</h2>
          <p className="text-gray-600 dark:text-gray-400">Connect and collaborate with your team</p>
        </div>
        <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
          <Plus className="w-5 h-5" />
          <span>Create Post</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
        <div className="flex border-b border-gray-200 dark:border-gray-800 p-2">
          <button
            onClick={() => setCurrentTab("posts")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex-1 ${
              currentTab === "posts"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Posts</span>
          </button>
          <button
            onClick={() => setCurrentTab("polls")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex-1 ${
              currentTab === "polls"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Polls</span>
          </button>
          <button
            onClick={() => setCurrentTab("praise")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex-1 ${
              currentTab === "praise"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <ThumbsUp className="w-5 h-5" />
            <span>Praise</span>
          </button>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-semibold">Total Posts</p>
              <p className="text-4xl font-bold mt-2">24</p>
              <p className="text-blue-100 text-xs mt-1">This month</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-semibold">Active Polls</p>
              <p className="text-4xl font-bold mt-2">3</p>
              <p className="text-purple-100 text-xs mt-1">Awaiting your vote</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-semibold">Praise Given</p>
              <p className="text-4xl font-bold mt-2">15</p>
              <p className="text-yellow-100 text-xs mt-1">Recognition points</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
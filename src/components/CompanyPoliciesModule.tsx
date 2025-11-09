import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Search, Filter, FileText, Download, CheckCircle, MessageSquare, Clock, TrendingUp } from "lucide-react";

export function CompanyPoliciesModule() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);

  const policies = useQuery(api.policies.getPolicies);
  
  const displayPolicies = searchTerm 
    ? policies?.filter((policy: any) => 
        policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : policies;
  const filteredPolicies = selectedCategory === "all" 
    ? displayPolicies 
    : displayPolicies?.filter((policy: any) => policy.category === selectedCategory);

  const categories = policies ? [...new Set(policies.map(p => p.category))] : [];

  const formatPolicyContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h4 key={index} className="font-bold text-lg text-gray-900 dark:text-white mt-4 mb-2">
            {line.replace(/\*\*/g, '')}
          </h4>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-4 text-gray-700 dark:text-gray-300 mb-1">
            {line.substring(2)}
          </li>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <li key={index} className="ml-4 text-gray-700 dark:text-gray-300 mb-1 list-decimal">
            {line.substring(line.indexOf('.') + 1).trim()}
          </li>
        );
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return (
        <p key={index} className="text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Attendance':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'Leave Management':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Ethics':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'Performance':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Company Policies</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Stay informed about company guidelines and procedures</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-green-800 dark:text-green-400">Live Updates</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Search Policies
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, content, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white appearance-none"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Policy List */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-600 to-purple-600">
              <h3 className="text-xl font-bold text-white flex items-center">
                <FileText className="w-6 h-6 mr-2" />
                Policy Directory
              </h3>
              <p className="text-sm text-blue-100 mt-1">
                {filteredPolicies?.length || 0} policies found
              </p>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {filteredPolicies?.map((policy: any) => (
                <button
                  key={policy.id}
                  onClick={() => setSelectedPolicy(policy)}
                  className={`w-full text-left p-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 ${
                    selectedPolicy?.id === policy.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">{policy.title}</h4>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(policy.category)}`}>
                        {policy.category}
                      </span>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>Updated: {new Date(policy.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="ml-2">
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full font-semibold">
                        v{policy.version}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Policy Content */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
            {selectedPolicy ? (
              <>
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        {selectedPolicy.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`px-4 py-2 rounded-full font-bold border ${getCategoryColor(selectedPolicy.category)}`}>
                          {selectedPolicy.category}
                        </span>
                        <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                          <span className="font-semibold">Version</span>
                          <span>{selectedPolicy.version}</span>
                        </span>
                        <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(selectedPolicy.lastUpdated).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                    <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
                      <Download className="w-5 h-5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="prose max-w-none">
                    {formatPolicyContent(selectedPolicy.content)}
                  </div>
                  
                  {/* Policy Actions */}
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
                          <CheckCircle className="w-5 h-5" />
                          <span>Acknowledge</span>
                        </button>
                        <button className="flex items-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
                          <MessageSquare className="w-5 h-5" />
                          <span>Ask Question</span>
                        </button>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
                        Policy ID: <span className="text-gray-700 dark:text-gray-300">{selectedPolicy.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <FileText className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select a Policy</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a policy from the directory to view its details and content.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-semibold">Attendance</p>
              <p className="text-4xl font-bold mt-2">95%</p>
              <p className="text-green-100 text-xs mt-1">Compliance Rate</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-semibold">Leave Policies</p>
              <p className="text-4xl font-bold mt-2">12</p>
              <p className="text-blue-100 text-xs mt-1">Days Remaining</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-semibold">Code of Conduct</p>
              <p className="text-4xl font-bold mt-2">100%</p>
              <p className="text-purple-100 text-xs mt-1">Acknowledged</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-semibold">Performance</p>
              <p className="text-4xl font-bold mt-2">4.8</p>
              <p className="text-orange-100 text-xs mt-1">Rating</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
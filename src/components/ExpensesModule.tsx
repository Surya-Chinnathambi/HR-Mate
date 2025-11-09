import { useState } from "react";
import { Doc } from "../../convex/_generated/dataModel";

interface ExpensesModuleProps {
  employee: Doc<"employees">;
}

export function ExpensesModule({ employee }: ExpensesModuleProps) {
  const [activeTab, setActiveTab] = useState<"expenses" | "travel" | "reimbursements">("expenses");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Expenses & Travel</h2>
        <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 font-medium">
          + New Expense
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab("expenses")}
            className={`px-6 py-4 font-medium text-sm transition-colors ${
              activeTab === "expenses"
                ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            💳 Expense Claims
          </button>
          <button
            onClick={() => setActiveTab("travel")}
            className={`px-6 py-4 font-medium text-sm transition-colors ${
              activeTab === "travel"
                ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            ✈️ Travel Requests
          </button>
          <button
            onClick={() => setActiveTab("reimbursements")}
            className={`px-6 py-4 font-medium text-sm transition-colors ${
              activeTab === "reimbursements"
                ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            💰 Reimbursements
          </button>
        </div>

        <div className="p-6">
          {activeTab === "expenses" && (
            <div className="space-y-6">
              {/* Expense Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm mb-1">This Month</p>
                      <p className="text-3xl font-bold">₹12,450</p>
                    </div>
                    <div className="w-14 h-14 bg-green-400 rounded-full flex items-center justify-center">
                      <span className="text-green-800 text-2xl">💳</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm mb-1">Pending Approval</p>
                      <p className="text-3xl font-bold">₹3,200</p>
                    </div>
                    <div className="w-14 h-14 bg-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-blue-800 text-2xl">⏳</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm mb-1">Reimbursed</p>
                      <p className="text-3xl font-bold">₹9,250</p>
                    </div>
                    <div className="w-14 h-14 bg-purple-400 rounded-full flex items-center justify-center">
                      <span className="text-purple-800 text-2xl">✅</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Expenses */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Expenses</h3>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Client Meeting Lunch</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">December 15, 2024 • Food & Beverage</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">₹2,450</p>
                      <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                    Business lunch with potential client to discuss project requirements.
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">📎 Receipt attached</span>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Uber to Airport</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">December 12, 2024 • Transportation</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">₹750</p>
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                        Approved
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                    Transportation for business trip to Mumbai office.
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">📎 Receipt attached</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "travel" && (
            <div className="space-y-6">
              {/* Travel Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm mb-1">Upcoming Trips</p>
                      <p className="text-3xl font-bold">2</p>
                    </div>
                    <div className="w-14 h-14 bg-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-blue-800 text-2xl">✈️</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm mb-1">Travel Budget Used</p>
                      <p className="text-3xl font-bold">65%</p>
                    </div>
                    <div className="w-14 h-14 bg-green-400 rounded-full flex items-center justify-center">
                      <span className="text-green-800 text-2xl">💰</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Travel Requests */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Travel Requests</h3>
                
                <div className="border border-blue-200 dark:border-blue-800 rounded-xl p-6 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Mumbai Office Visit</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">January 15-17, 2025 • Business Trip</p>
                    </div>
                    <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                      Approved
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 mb-1">Flight</p>
                      <p className="font-semibold text-gray-900 dark:text-white">₹8,500</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 mb-1">Hotel</p>
                      <p className="font-semibold text-gray-900 dark:text-white">₹6,000</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 mb-1">Meals</p>
                      <p className="font-semibold text-gray-900 dark:text-white">₹3,000</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 mb-1">Total</p>
                      <p className="font-semibold text-gray-900 dark:text-white">₹17,500</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    Quarterly business review meeting with Mumbai team and client presentations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reimbursements" && (
            <div className="space-y-6">
              {/* Reimbursement Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Submitted</h3>
                    <span className="text-3xl">📤</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">₹5,650</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">3 claims pending</p>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Processing</h3>
                    <span className="text-3xl">⏳</span>
                  </div>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">₹3,200</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Under review</p>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Completed</h3>
                    <span className="text-3xl">✅</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">₹12,450</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This month</p>
                </div>
              </div>

              {/* Reimbursement History */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Reimbursement History</h3>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">December Expenses</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Processed on Dec 20, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600 dark:text-green-400 mb-1">₹4,250</p>
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                        Paid
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    Reimbursement for travel expenses and client meeting costs.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">November Expenses</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Processed on Nov 25, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600 dark:text-green-400 mb-1">₹8,200</p>
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                        Paid
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    Monthly reimbursement including office supplies and transportation.
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
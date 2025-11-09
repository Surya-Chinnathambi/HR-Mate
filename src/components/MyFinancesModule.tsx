import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { DollarSign, TrendingUp, FileText, Download } from "lucide-react";

interface MyFinancesModuleProps {
  employee: Doc<"employees">;
}

export function MyFinancesModule({ employee }: MyFinancesModuleProps) {
  const payrollRecords = useQuery(api.payroll.getPayrollHistory, { employeeId: employee._id });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-8 rounded-2xl shadow-xl border border-blue-500 dark:border-blue-600">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-blue-100 text-sm font-semibold mb-2">Annual Salary</p>
          <p className="text-3xl font-bold text-white">₹{(employee.salary || 0 * 12).toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 p-8 rounded-2xl shadow-xl border border-purple-500 dark:border-purple-600">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-purple-100 text-sm font-semibold mb-2">Monthly Salary</p>
          <p className="text-3xl font-bold text-white">₹{(employee.salary || 0).toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 p-8 rounded-2xl shadow-xl border border-green-500 dark:border-green-600">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-green-100 text-sm font-semibold mb-2">Tax Documents</p>
          <p className="text-3xl font-bold text-white">{payrollRecords?.length || 0}</p>
        </div>
      </div>

      {/* Recent Payslips */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Payslips</h2>
              <p className="text-gray-600 dark:text-gray-400">Your payment history and records</p>
            </div>
            <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
              <Download className="w-5 h-5" />
              <span>Download All</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {payrollRecords?.slice(0, 3).map((record, index) => (
            <div 
              key={record._id} 
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    index === 0 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                      : 'bg-gradient-to-br from-gray-400 to-gray-500'
                  }`}>
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">
                      Pay Period: {record.period}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800">
                        Paid
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(record._creationTime).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Net Pay</p>
                    <p className="font-bold text-2xl text-gray-900 dark:text-white">
                      ₹{record.netPay.toLocaleString()}
                    </p>
                  </div>
                  <button className="p-3 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(!payrollRecords || payrollRecords.length === 0) && (
          <div className="p-12 text-center">
            <FileText className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Payroll Records</h3>
            <p className="text-gray-600 dark:text-gray-400">Your payslips will appear here once generated.</p>
          </div>
        )}
      </div>

      {/* Tax Summary */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tax Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200 dark:border-orange-800">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Current Financial Year</h3>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">FY 2024-25</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              April 2024 - March 2025
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Tax Status</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">Up to Date</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              All documents submitted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
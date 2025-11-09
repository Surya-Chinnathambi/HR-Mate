import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { DollarSign, FileText, Download, Calendar, TrendingUp } from "lucide-react";

interface PayrollModuleProps {
  employee: Doc<"employees">;
}

export function PayrollModule({ employee }: PayrollModuleProps) {
  const payrollRecords = useQuery(api.payroll.getPayrollHistory, {
    employeeId: employee._id,
  });

  const totalPaid = payrollRecords?.reduce((sum, record) => sum + record.netPay, 0) || 0;
  const avgPayment = payrollRecords?.length ? totalPaid / payrollRecords.length : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-6 rounded-2xl shadow-xl border border-blue-500 dark:border-blue-600">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-blue-100 text-sm font-semibold mb-1">Total Payslips</p>
          <p className="text-3xl font-bold text-white">{payrollRecords?.length || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 p-6 rounded-2xl shadow-xl border border-green-500 dark:border-green-600">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-green-100 text-sm font-semibold mb-1">Total Paid</p>
          <p className="text-3xl font-bold text-white">₹{totalPaid.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 p-6 rounded-2xl shadow-xl border border-purple-500 dark:border-purple-600">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-purple-100 text-sm font-semibold mb-1">Average Payment</p>
          <p className="text-3xl font-bold text-white">₹{Math.round(avgPayment).toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-orange-700 dark:from-orange-700 dark:to-orange-800 p-6 rounded-2xl shadow-xl border border-orange-500 dark:border-orange-600">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-orange-100 text-sm font-semibold mb-1">Last Payment</p>
          <p className="text-2xl font-bold text-white">
            {payrollRecords?.length ? new Date(payrollRecords[0]._creationTime).toLocaleDateString('en-US', { month: 'short' }) : '-'}
          </p>
        </div>
      </div>

      {/* Payroll History */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payroll History</h2>
              <p className="text-gray-600 dark:text-gray-400">Your complete payment records</p>
            </div>
            <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
              <Download className="w-5 h-5" />
              <span>Download All</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {payrollRecords && payrollRecords.length > 0 ? (
            payrollRecords.map((record, index) => (
              <div 
                key={record._id} 
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md ${
                      index === 0 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}>
                      <FileText className="w-7 h-7 text-white" />
                    </div>

                    {/* Details */}
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        Pay Period: {record.period}
                      </h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800">
                          ✓ Paid
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(record._creationTime).toLocaleDateString()}</span>
                        </span>
                      </div>

                      {/* Payment Breakdown */}
                      <div className="mt-3 flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                        <div>
                          <span className="font-semibold">Gross:</span> ₹{record.grossPay?.toLocaleString() || record.netPay.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-semibold">Deductions:</span> ₹{((record.grossPay || record.netPay) - record.netPay).toLocaleString()}
                        </div>
                        <div>
                          <span className="font-semibold">Tax:</span> ₹{Math.round((record.netPay * 0.1)).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Net Pay and Actions */}
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Net Pay</p>
                      <p className="font-bold text-3xl text-gray-900 dark:text-white">
                        ₹{record.netPay.toLocaleString()}
                      </p>
                    </div>
                    <button className="p-3 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100">
                      <Download className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <FileText className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Payroll Records</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your payslips will appear here once generated.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Timeline */}
      {payrollRecords && payrollRecords.length > 0 && (
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Payment Timeline</h3>
          <div className="space-y-3">
            {payrollRecords.slice(0, 6).map((record, index) => {
              const percentage = (record.netPay / totalPaid) * 100;
              
              return (
                <div key={record._id}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {record.period}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      ₹{record.netPay.toLocaleString()} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        index === 0 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                          : 'bg-gradient-to-r from-gray-400 to-gray-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { Doc } from "../../convex/_generated/dataModel";

interface HelpdeskModuleProps {
  employee: Doc<"employees">;
}

export function HelpdeskModule({ employee }: HelpdeskModuleProps) {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const tickets = [
    {
      id: "1",
      title: "Password Reset Request",
      description: "Unable to access my account after password change",
      status: "Open",
      priority: "Medium",
      category: "IT Support",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      title: "Software Installation",
      description: "Need Adobe Creative Suite installed on my workstation",
      status: "In Progress",
      priority: "Low",
      category: "IT Support",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      title: "Office Equipment Request",
      description: "Requesting a new ergonomic chair for my workspace",
      status: "Resolved",
      priority: "Low",
      category: "Facilities",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
      case "In Progress":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400";
      case "Resolved":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
      case "Medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400";
      case "Low":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Helpdesk</h2>
        <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 font-medium">
          + Create Ticket
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Open Tickets</p>
              <p className="text-3xl font-bold">1</p>
            </div>
            <div className="w-14 h-14 bg-red-400 rounded-full flex items-center justify-center">
              <span className="text-red-800 text-2xl">🎫</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">In Progress</p>
              <p className="text-3xl font-bold">1</p>
            </div>
            <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-yellow-800 text-2xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Resolved</p>
              <p className="text-3xl font-bold">1</p>
            </div>
            <div className="w-14 h-14 bg-green-400 rounded-full flex items-center justify-center">
              <span className="text-green-800 text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Avg Response</p>
              <p className="text-3xl font-bold">2h</p>
            </div>
            <div className="w-14 h-14 bg-blue-400 rounded-full flex items-center justify-center">
              <span className="text-blue-800 text-2xl">⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <span className="mr-2">🎫</span>
            My Tickets
          </h3>
        </div>
        <div className="p-6">
          {tickets.length > 0 ? (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer bg-white dark:bg-gray-800"
                  onClick={() => setSelectedTicket(selectedTicket === ticket.id ? null : ticket.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">{ticket.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{ticket.description}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-500">
                        <span className="font-medium">#{ticket.id}</span>
                        <span>•</span>
                        <span>{ticket.category}</span>
                        <span>•</span>
                        <span>Created {ticket.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                  
                  {selectedTicket === ticket.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 block mb-1">Status</label>
                          <p className="text-gray-900 dark:text-white font-medium">{ticket.status}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 block mb-1">Priority</label>
                          <p className="text-gray-900 dark:text-white font-medium">{ticket.priority}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 block mb-1">Category</label>
                          <p className="text-gray-900 dark:text-white font-medium">{ticket.category}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 block mb-1">Last Updated</label>
                          <p className="text-gray-900 dark:text-white font-medium">{ticket.updatedAt.toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">Add Comment</label>
                        <textarea 
                          className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          rows={3}
                          placeholder="Add a comment or update..."
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                          Add Comment
                        </button>
                        <button className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-colors text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                          Close Ticket
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎫</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Support Tickets</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't created any support tickets yet.</p>
              <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 font-medium">
                Create Your First Ticket
              </button>
            </div>
          )}
        </div>
      </div>

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
            <button className="flex flex-col items-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all bg-white dark:bg-gray-900">
              <span className="text-4xl mb-3">💻</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">IT Support</span>
            </button>
            <button className="flex flex-col items-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all bg-white dark:bg-gray-900">
              <span className="text-4xl mb-3">🏢</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Facilities</span>
            </button>
            <button className="flex flex-col items-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all bg-white dark:bg-gray-900">
              <span className="text-4xl mb-3">👥</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">HR Support</span>
            </button>
            <button className="flex flex-col items-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all bg-white dark:bg-gray-900">
              <span className="text-4xl mb-3">❓</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">General</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
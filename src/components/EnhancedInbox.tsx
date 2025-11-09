import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { 
  Inbox, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  DollarSign, 
  FileText, 
  AlertCircle,
  Filter,
  Search,
  Bell,
  BellOff
} from 'lucide-react';
import { toast } from 'sonner';

interface InboxItem {
  _id: string;
  title: string;
  description: string;
  type: string;
  entityId: string;
  entityType: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'expired';
  dueDate?: string;
  metadata: {
    employeeName?: string;
    amount?: number;
    days?: number;
    period?: string;
  };
  _creationTime: number;
}

export const EnhancedInbox: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const inboxItems = useQuery(api.realtime.getInboxItems) || [];
  const notifications = useQuery(api.realtime.getNotifications) || { notifications: [], unreadCount: 0 };
  
  const markNotificationRead = useMutation(api.realtime.markNotificationRead);
  const approveRequest = useMutation(api.leaves.approveRequest);
  const rejectRequest = useMutation(api.leaves.rejectRequest);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'leave_approval':
        return <Calendar className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
      case 'attendance_regularization':
        return <Clock className="w-5 h-5 text-orange-500 dark:text-orange-400" />;
      case 'timesheet_approval':
        return <FileText className="w-5 h-5 text-green-500 dark:text-green-400" />;
      case 'expense_approval':
        return <DollarSign className="w-5 h-5 text-purple-500 dark:text-purple-400" />;
      case 'overtime_approval':
        return <Clock className="w-5 h-5 text-red-500 dark:text-red-400" />;
      default:
        return <Inbox className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  const handleApprove = async (item: InboxItem) => {
    try {
      if (item.type === 'leave_approval') {
        await approveRequest({
          requestId: item.entityId,
          type: item.type,
          comments: 'Approved via inbox',
        });
      }
      toast.success('Request approved successfully');
    } catch (error) {
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async (item: InboxItem) => {
    try {
      if (item.type === 'leave_approval') {
        await rejectRequest({
          requestId: item.entityId,
          type: item.type,
          comments: 'Rejected via inbox',
        });
      }
      toast.success('Request rejected');
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  const filteredItems = inboxItems.filter(item => {
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
    const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.metadata.employeeName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesPriority && matchesSearch;
  });

  const pendingItems = filteredItems.filter(item => item.status === 'pending');
  const completedItems = filteredItems.filter(item => item.status === 'completed');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <Inbox className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inbox</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {pendingItems.length} pending items • {notifications.unreadCount} unread notifications
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 font-medium">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
            {notifications.unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {notifications.unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search inbox..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="leave_approval">Leave Approvals</option>
              <option value="attendance_regularization">Attendance</option>
              <option value="timesheet_approval">Timesheets</option>
              <option value="expense_approval">Expenses</option>
              <option value="overtime_approval">Overtime</option>
            </select>
          </div>
          
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-100 mb-1">Pending</p>
              <p className="text-3xl font-bold">{pendingItems.length}</p>
            </div>
            <Clock className="w-10 h-10 text-orange-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100 mb-1">Completed</p>
              <p className="text-3xl font-bold">{completedItems.length}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-100 mb-1">High Priority</p>
              <p className="text-3xl font-bold">
                {pendingItems.filter(item => item.priority === 'high').length}
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-red-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100 mb-1">Notifications</p>
              <p className="text-3xl font-bold">{notifications.unreadCount}</p>
            </div>
            <Bell className="w-10 h-10 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Inbox Items */}
      <div className="space-y-6">
        {/* Pending Items */}
        {pendingItems.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pending Actions</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Items requiring your attention</p>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {pendingItems.map((item) => (
                <div key={item._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {getTypeIcon(item.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{item.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
                          {item.metadata.employeeName && (
                            <span>Employee: {item.metadata.employeeName}</span>
                          )}
                          {item.metadata.days && (
                            <span>Days: {item.metadata.days}</span>
                          )}
                          {item.metadata.amount && (
                            <span>Amount: ${item.metadata.amount}</span>
                          )}
                          {item.dueDate && (
                            <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleApprove(item)}
                        className="flex items-center space-x-1 px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(item)}
                        className="flex items-center space-x-1 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Notifications */}
        {notifications.notifications.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Notifications</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Latest updates and alerts</p>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {notifications.notifications.slice(0, 10).map((notification) => (
                <div 
                  key={notification._id} 
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{notification.title}</h3>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">{notification.message}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(notification._creationTime).toLocaleString()}
                      </p>
                    </div>
                    
                    {!notification.isRead && (
                      <button
                        onClick={() => markNotificationRead({ notificationId: notification._id })}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors ml-4"
                      >
                        <BellOff className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {pendingItems.length === 0 && notifications.notifications.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-16 text-center">
            <Inbox className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">All caught up!</h3>
            <p className="text-gray-600 dark:text-gray-400">No pending items or notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};
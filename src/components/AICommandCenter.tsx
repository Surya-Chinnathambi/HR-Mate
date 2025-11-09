import { useState, useRef, useEffect } from "react";
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface AICommandCenterProps {
  onClose: () => void;
  employee: any;
}

interface Message {
  id: number;
  type: "ai" | "user";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export function AICommandCenter({ onClose, employee }: AICommandCenterProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content: `Hello ${employee.firstName}! 👋 I'm your AI HR Assistant powered by Azure GPT-5. I can help you with:

• Clock in/out and attendance tracking
• Leave applications and balance checks  
• Payroll and salary information
• Team member details
• HR policies and procedures
• Company announcements and updates

What would you like to do today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Queries for real-time data
  const leaveBalance = useQuery(api.leaves.getLeaveBalance, {
    employeeId: employee._id,
    year: new Date().getFullYear(),
  });
  // Extract leave balances by type code for easy access
  const leaveBalanceCasual = leaveBalance?.find(l => l.leaveType.code?.toLowerCase() === "cl");
  const leaveBalanceSick = leaveBalance?.find(l => l.leaveType.code?.toLowerCase() === "sl");
  const leaveBalanceAnnual = leaveBalance?.find(l => l.leaveType.code?.toLowerCase() === "el");

  const casual = leaveBalanceCasual?.balance?.balance ?? 0;
  const sick = leaveBalanceSick?.balance?.balance ?? 0;
  const annual = leaveBalanceAnnual?.balance?.balance ?? 0;

  const used = {
    casual: leaveBalanceCasual?.balance?.consumed ?? 0,
    sick: leaveBalanceSick?.balance?.consumed ?? 0,
    annual: leaveBalanceAnnual?.balance?.consumed ?? 0,
  };

  const todayAttendance = useQuery(api.attendance.getTodayAttendance, {
    employeeId: employee._id,
  });
  const teammates = useQuery(api.employees.getTeammates, {
    department: employee.department,
    excludeId: employee._id,
  });
  const attendanceStats = useQuery(api.realtime.getAttendanceStats, {
    employeeId: employee._id,
    month: (new Date().getMonth() + 1).toString(),
    year: new Date().getFullYear(),
  });
  const policies = useQuery(api.policies.getPolicies) || [];

  // Mutations for AI actions
  const checkIn = useMutation(api.attendance.checkIn);
  const checkOut = useMutation(api.attendance.checkOut);
  const applyLeave = useMutation(api.leaves.applyLeave);
  const generateAIResponse = useAction(api.ai.generateSmartResponse);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Check if this is an action command
      const actionResult = await handleActionCommand(inputMessage);

      if (actionResult) {
        const aiResponse: Message = {
          id: messages.length + 2,
          type: "ai",
          content: actionResult,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        // Generate AI response with enhanced context
        const context = {
          employee: {
            name: `${employee.firstName} ${employee.lastName}`,
            department: employee.department,
            designation: employee.designation,
            employeeId: employee.employeeId,
          },
          leaveBalance: {
            casual,
            sick,
            annual,
            used,
          },
          todayAttendance: todayAttendance,
          teammates: teammates?.map(t => `${t.firstName} ${t.lastName} (${t.designation})`) || [],
          attendanceStats: attendanceStats,
          policies: policies?.map(p => ({ title: p.title, category: p.category })) || [],
          currentTime: new Date().toLocaleString(),
        };

        const aiResponseContent = await generateAIResponse({
          prompt: inputMessage,
          context: JSON.stringify(context),
          employeeId: employee._id,
        });

        const aiResponse: Message = {
          id: messages.length + 2,
          type: "ai",
          content: aiResponseContent || "I'm sorry, I couldn't process your request. Please try again.",
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error('AI response error:', error);
      const errorResponse: Message = {
        id: messages.length + 2,
        type: "ai",
        content: "I'm experiencing some technical difficulties. Please try again later.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionCommand = async (input: string): Promise<string | null> => {
    const lowerInput = input.toLowerCase();

    try {
      // Clock in command
      if (lowerInput.includes('clock in') || lowerInput.includes('check in')) {
        if (todayAttendance?.checkIn) {
          return `✅ You've already clocked in today at ${todayAttendance.checkIn}. Have a productive day! 💼

**Today's Status:**
• Check-in: ${todayAttendance.checkIn}
• Hours worked: ${todayAttendance.workHours?.toFixed(1) || '0.0'}h
• Status: Present`;
        }

        const now = new Date();
        const timeString = now.toTimeString().slice(0, 5);

        await checkIn({
          employeeId: employee._id,
          checkInTime: timeString,
        });

        return `✅ Successfully clocked in at ${timeString}! Welcome to work, ${employee.firstName}!

**Attendance Summary:**
• Today's check-in: ${timeString}
• This month: ${attendanceStats?.present || 0} days present
• Attendance rate: ${attendanceStats?.attendancePercentage?.toFixed(1) || 0}%`;
      }

      // Clock out command
      if (lowerInput.includes('clock out') || lowerInput.includes('check out')) {
        if (!todayAttendance?.checkIn) {
          return `❌ You haven't clocked in today yet. Please clock in first! ⏰`;
        }

        if (todayAttendance?.checkOut) {
          return `✅ You've already clocked out today at ${todayAttendance.checkOut}. See you tomorrow! 👋

**Today's Summary:**
• Check-in: ${todayAttendance.checkIn}
• Check-out: ${todayAttendance.checkOut}
• Total hours: ${todayAttendance.workHours?.toFixed(1) || '0.0'}h`;
        }

        const now = new Date();
        const timeString = now.toTimeString().slice(0, 5);

        await checkOut({
          employeeId: employee._id,
          checkOutTime: timeString,
        });

        return `✅ Successfully clocked out at ${timeString}! Have a great evening, ${employee.firstName}!

**Today's Work Summary:**
• Check-in: ${todayAttendance.checkIn}
• Check-out: ${timeString}
• Hours worked: Calculating...`;
      }

      // Leave balance inquiry
      if (lowerInput.includes('leave balance') || lowerInput.includes('show balance')) {
        return `📊 **Your Leave Balance for ${new Date().getFullYear()}:**

🏖️ **Casual Leave:** ${casual} days remaining
🏥 **Sick Leave:** ${sick} days remaining  
✈️ **Annual Leave:** ${annual} days remaining

**Used This Year:**
• Casual: ${used.casual} days
• Sick: ${used.sick} days
• Annual: ${used.annual} days

Need to apply for leave? Just ask me "apply leave" or use the Leave module!`;
      }

      // Team members inquiry
      if (lowerInput.includes('teammates') || lowerInput.includes('team members')) {
        const teamList = teammates?.map(t => `• ${t.firstName} ${t.lastName} - ${t.designation}`).join('\n') || '• No teammates found';

        return `👥 **Your Team Members in ${employee.department}:**

${teamList}

**Team Stats:**
• Total members: ${teammates?.length || 0}
• Department: ${employee.department}

Want to know more about a specific team member? Just ask!`;
      }

      // Policy inquiry
      if (lowerInput.includes('policy') || lowerInput.includes('policies')) {
        const policyList = policies?.slice(0, 5).map(p => `• ${p.title} (${p.category})`).join('\n') || '• Loading policies...';

        return `📋 **Company Policies Available:**

${policyList}

You can access the full Company Policies module for detailed information, or ask me about a specific policy like "attendance policy" or "leave policy".`;
      }

      // Apply leave command
      if (lowerInput.includes('apply leave') || lowerInput.includes('request leave')) {
        const casualMatch = lowerInput.match(/(\d+)\s*day[s]?\s*(casual|sick|annual)/);
        if (casualMatch) {
          const days = parseInt(casualMatch[1]);
          const leaveType = casualMatch[2] as "casual" | "sick" | "annual";

          const startDate = new Date();
          startDate.setDate(startDate.getDate() + 1);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + days - 1);

          await applyLeave({
            employeeId: employee._id,
            leaveType,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            reason: `Leave requested via AI Assistant`,
          });

          return `✅ **Leave Application Submitted Successfully!**

**Details:**
• Type: ${leaveType.charAt(0).toUpperCase() + leaveType.slice(1)} Leave
• Duration: ${days} day(s)
• Start Date: ${startDate.toLocaleDateString()}
• End Date: ${endDate.toLocaleDateString()}
• Status: Pending Approval

Your manager will be notified for approval. You can track the status in the Leave module.`;
        }

        return `📝 **To apply for leave, please specify:**

**Format:** "Apply [number] days [type] leave"
**Examples:**
• "Apply 2 days casual leave"
• "Apply 1 day sick leave"  
• "Apply 5 days annual leave"

**Available Leave Types:**
• Casual: ${casual} days remaining
• Sick: ${sick} days remaining
• Annual: ${annual} days remaining

Or use the Leave module for detailed applications with specific dates and reasons.`;
      }

      return null;
    } catch (error) {
      console.error('Action command error:', error);
      return `❌ Sorry, I couldn't complete that action. Please try again or use the respective module.

**Available Commands:**
• "clock in" / "clock out"
• "show leave balance"
• "list teammates"
• "apply [X] days [type] leave"
• "show policies"`;
    }
  };

  const quickActions = [
    { label: "Clock In", command: "clock in", icon: "🕐", color: "bg-green-500" },
    { label: "Clock Out", command: "clock out", icon: "🕕", color: "bg-red-500" },
    { label: "Leave Balance", command: "show my leave balance", icon: "🏖️", color: "bg-blue-500" },
    { label: "Team Members", command: "list my teammates", icon: "👥", color: "bg-purple-500" },
    { label: "Apply Leave", command: "how to apply leave", icon: "📝", color: "bg-orange-500" },
    { label: "Policies", command: "show company policies", icon: "📋", color: "bg-indigo-500" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-['Nexa']">
      <div className="bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 backdrop-blur-md rounded-3xl w-full max-w-6xl h-[80vh] flex flex-col shadow-2xl border border-white/20">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/20 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-t-3xl">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl">🤖</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text">
                AI HR Assistant
              </h3>
              <p className="text-sm text-gray-600 flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Powered by Azure GPT-5 • Real-time Data • Company Policies</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <span className="text-gray-600 text-2xl">✕</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(action.command)}
                className={`${action.color} text-white px-4 py-2 rounded-xl text-sm font-medium hover:scale-105 transition-all duration-200 flex items-center space-x-2 shadow-lg`}
              >
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="flex items-start space-x-3 max-w-[85%]">
                {message.type === "ai" && (
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-lg">🤖</span>
                  </div>
                )}
                <div
                  className={`px-6 py-4 rounded-2xl shadow-lg ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-auto"
                      : "bg-white/90 backdrop-blur-sm text-gray-800 border border-white/20"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line font-medium">{message.content}</p>
                  <p className={`text-xs mt-3 ${
                    message.type === "user" ? "text-blue-100" : "text-gray-500"
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.type === "user" && (
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-lg">👤</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">🤖</span>
                </div>
                <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-white/20">
                  <div className="flex space-x-2 items-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600 ml-2 font-medium">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-sm rounded-b-3xl">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything or try commands like 'clock in', 'show leave balance', 'list teammates'..."
              className="flex-1 border border-white/20 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 font-medium"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 font-bold"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Send</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

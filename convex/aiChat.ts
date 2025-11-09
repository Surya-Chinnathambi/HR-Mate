import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

// AI Chat function with enhanced tool calling
export const chatWithAI = action({
  args: {
    message: v.string(),
    sessionId: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<{
    message: string;
    functionCalls: Array<{
      name: string;
      arguments: any;
      result?: any;
    }>;
  }> => {
    // Get user's employee record
    const employee: any = await ctx.runQuery(api.employees.getEmployeeByUserId, {
      userId: args.userId,
    });

    if (!employee) {
      return {
        message: "I couldn't find your employee profile. Please contact HR to set up your account.",
        functionCalls: [],
      };
    }

    // Enhanced system prompt for HR Assistant
    const systemPrompt: string = `You are the HR Assistant for our company's HRMS system. You help employees with HR-related tasks through natural language and function calling.

Current user: ${employee.firstName} ${employee.lastName} (ID: ${employee.employeeId})
Department: ${employee.department}
Designation: ${employee.designation}

You can perform these actions via function calls:
1. **Leave Management**
   - Apply for leave (check balance first)
   - Check leave balance and types
   - View leave history

2. **Attendance Management**
   - Clock in/out
   - View attendance records
   - Raise attendance regularization requests

3. **Timesheet & Projects**
   - Submit timesheet entries
   - View project assignments

4. **Expense Management**
   - Submit expense claims
   - View expense history

5. **Approvals** (if manager)
   - Approve/reject leave requests
   - Approve attendance regularizations
   - Approve expense claims

6. **Payroll & Finance**
   - View payslips
   - Check salary information

**IMPORTANT GUARDRAILS:**
- Always check relevant balances/policies before applying for leave
- If insufficient leave balance, suggest alternatives:
  * Raise attendance regularization
  * Apply for work from home
  * Use different leave type
- Confirm destructive actions before execution
- Show what will happen before doing it
- Explain policy restrictions clearly
- If policy blocks a request, explain why and suggest alternatives

**Response Style:**
- Be conversational, helpful, and professional
- Use emojis appropriately
- Provide clear explanations
- Always confirm successful actions
- Guide users through multi-step processes

**Slash Commands Support:**
Handle these commands naturally:
/leave - Leave applications and balance
/attendance - Attendance tracking and clock in/out
/timesheet - Project time logging
/expense - Expense claim submission
/approve - Approval workflows
/payslips - Salary and payroll information
/regularization - Attendance corrections
/help - Show available commands`;

    const tools = [
      {
        type: "function" as const,
        function: {
          name: "applyLeave",
          description: "Apply for leave after checking balance and policies. Always check balance first.",
          parameters: {
            type: "object",
            properties: {
              leaveTypeId: { 
                type: "string", 
                description: "Leave type ID (get from getLeaveTypes first)" 
              },
              startDate: { 
                type: "string", 
                description: "Start date in YYYY-MM-DD format" 
              },
              endDate: { 
                type: "string", 
                description: "End date in YYYY-MM-DD format" 
              },
              reason: { 
                type: "string", 
                description: "Detailed reason for leave" 
              },
              partialDay: { 
                type: "string", 
                enum: ["first_half", "second_half"],
                description: "Optional: For half-day leave" 
              },
            },
            required: ["leaveTypeId", "startDate", "endDate", "reason"],
          },
        },
      },
      {
        type: "function" as const,
        function: {
          name: "getLeaveBalance",
          description: "Get current leave balance for the employee",
          parameters: {
            type: "object",
            properties: {
              year: { 
                type: "number", 
                description: "Year to check balance for (default: current year)" 
              },
            },
          },
        },
      },
      {
        type: "function" as const,
        function: {
          name: "getLeaveTypes",
          description: "Get all available leave types and their policies",
          parameters: {
            type: "object",
            properties: {},
          },
        },
      },
      {
        type: "function" as const,
        function: {
          name: "getAttendance",
          description: "Get attendance records for a date range",
          parameters: {
            type: "object",
            properties: {
              startDate: { 
                type: "string", 
                description: "Start date in YYYY-MM-DD format" 
              },
              endDate: { 
                type: "string", 
                description: "End date in YYYY-MM-DD format" 
              },
            },
            required: ["startDate", "endDate"],
          },
        },
      },
      {
        type: "function" as const,
        function: {
          name: "clockInOut",
          description: "Clock in or out for attendance tracking",
          parameters: {
            type: "object",
            properties: {
              action: { 
                type: "string", 
                enum: ["in", "out"], 
                description: "Whether to clock in or out" 
              },
              location: { 
                type: "string", 
                description: "Optional: Location information" 
              },
            },
            required: ["action"],
          },
        },
      },
      {
        type: "function" as const,
        function: {
          name: "raiseRegularization",
          description: "Raise attendance regularization request for missed punch or corrections",
          parameters: {
            type: "object",
            properties: {
              date: { 
                type: "string", 
                description: "Date to regularize in YYYY-MM-DD format" 
              },
              reason: { 
                type: "string", 
                description: "Detailed reason for regularization" 
              },
              requestedCheckIn: { 
                type: "string", 
                description: "Optional: Requested check-in time (HH:MM format)" 
              },
              requestedCheckOut: { 
                type: "string", 
                description: "Optional: Requested check-out time (HH:MM format)" 
              },
            },
            required: ["date", "reason"],
          },
        },
      },
      {
        type: "function" as const,
        function: {
          name: "submitTimesheet",
          description: "Submit timesheet entries for project work",
          parameters: {
            type: "object",
            properties: {
              weekStart: { 
                type: "string", 
                description: "Week start date in YYYY-MM-DD format" 
              },
              entries: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    date: { type: "string", description: "Date in YYYY-MM-DD format" },
                    projectId: { type: "string", description: "Project ID" },
                    hours: { type: "number", description: "Hours worked" },
                    description: { type: "string", description: "Work description" },
                    billable: { type: "boolean", description: "Whether hours are billable" },
                  },
                  required: ["date", "projectId", "hours", "billable"],
                },
                description: "Array of timesheet entries for the week"
              },
            },
            required: ["weekStart", "entries"],
          },
        },
      },
      {
        type: "function" as const,
        function: {
          name: "submitExpense",
          description: "Submit expense claim for reimbursement",
          parameters: {
            type: "object",
            properties: {
              categoryId: { 
                type: "string", 
                description: "Expense category ID" 
              },
              amount: { 
                type: "number", 
                description: "Expense amount" 
              },
              currency: { 
                type: "string", 
                description: "Currency code (default: USD)" 
              },
              description: { 
                type: "string", 
                description: "Expense description" 
              },
              expenseDate: { 
                type: "string", 
                description: "Date of expense in YYYY-MM-DD format" 
              },
              receiptUrl: { 
                type: "string", 
                description: "Optional: Receipt image URL" 
              },
            },
            required: ["categoryId", "amount", "description", "expenseDate"],
          },
        },
      },
      {
        type: "function" as const,
        function: {
          name: "approveRequest",
          description: "Approve or reject requests (for managers only)",
          parameters: {
            type: "object",
            properties: {
              requestType: { 
                type: "string", 
                enum: ["leave", "regularization", "expense", "timesheet"],
                description: "Type of request to approve" 
              },
              requestId: { 
                type: "string", 
                description: "ID of the request to process" 
              },
              decision: { 
                type: "string", 
                enum: ["approve", "reject"],
                description: "Approval decision" 
              },
              comments: { 
                type: "string", 
                description: "Optional: Comments for the decision" 
              },
            },
            required: ["requestType", "requestId", "decision"],
          },
        },
      },
      {
        type: "function" as const,
        function: {
          name: "getPayslips",
          description: "Get payslip information for specified period",
          parameters: {
            type: "object",
            properties: {
              period: { 
                type: "string", 
                description: "Period in YYYY-MM format (default: current month)" 
              },
            },
          },
        },
      },
    ];

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: args.message },
        ],
        tools,
        tool_choice: "auto",
        temperature: 0.7,
      });

      const response = completion.choices[0].message;
      const functionCalls = [];

      // Execute function calls if any
      if (response.tool_calls) {
        for (const toolCall of response.tool_calls) {
          const functionName = (toolCall as any).function.name;
          const functionArgs = JSON.parse((toolCall as any).function.arguments);

          let result;
          try {
            switch (functionName) {
              case "applyLeave":
                result = await ctx.runMutation(api.leaves.applyLeave, {
                  employeeId: employee._id,
                  ...functionArgs,
                });
                break;
              case "getLeaveBalance":
                result = await ctx.runQuery(api.leaves.getLeaveBalance, {
                  employeeId: employee._id,
                  year: functionArgs.year || new Date().getFullYear(),
                });
                break;
              case "getLeaveTypes":
                result = await ctx.runQuery(api.leaves.getLeaveTypes);
                break;
              case "getAttendance":
                result = await ctx.runQuery(api.attendance.getAttendanceRange, {
                  employeeId: employee._id,
                  startDate: functionArgs.startDate,
                  endDate: functionArgs.endDate,
                });
                break;
              case "clockInOut":
                if (functionArgs.action === "in") {
                  result = await ctx.runMutation(api.attendance.clockIn, {
                    employeeId: employee._id,
                    location: functionArgs.location ? {
                      latitude: 0,
                      longitude: 0,
                      accuracy: 0,
                    } : undefined,
                  });
                } else {
                  result = await ctx.runMutation(api.attendance.clockOut, {
                    employeeId: employee._id,
                    location: functionArgs.location ? {
                      latitude: 0,
                      longitude: 0,
                      accuracy: 0,
                    } : undefined,
                  });
                }
                break;
              case "raiseRegularization":
                result = await ctx.runMutation(api.attendance.applyRegularization, {
                  employeeId: employee._id,
                  ...functionArgs,
                });
                break;
              case "submitTimesheet":
                // This would need a timesheet mutation - placeholder for now
                result = { message: "Timesheet submission feature coming soon" };
                break;
              case "submitExpense":
                // This would need an expense mutation - placeholder for now
                result = { message: "Expense submission feature coming soon" };
                break;
              case "approveRequest":
                // This would need approval mutations - placeholder for now
                result = { message: "Approval feature coming soon" };
                break;
              case "getPayslips":
                result = await ctx.runQuery(api.payroll.getPayrollHistory, {
                  employeeId: employee._id,
                  month: functionArgs.period ? parseInt(functionArgs.period.split('-')[1]) : undefined,
                  year: functionArgs.period ? parseInt(functionArgs.period.split('-')[0]) : undefined,
                });
                break;
              default:
                result = { error: "Unknown function" };
            }

            functionCalls.push({
              name: functionName,
              arguments: functionArgs,
              result,
            });
          } catch (error: any) {
            functionCalls.push({
              name: functionName,
              arguments: functionArgs,
              result: { error: error.message },
            });
          }
        }

        // Generate follow-up response with function results
        const followUpCompletion: any = await openai.chat.completions.create({
          model: "gpt-4.1-nano",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: args.message },
            response,
            {
              role: "tool",
              content: JSON.stringify(functionCalls.map(fc => ({
                name: fc.name,
                result: fc.result
              }))),
              tool_call_id: response.tool_calls[0].id,
            },
          ],
          temperature: 0.7,
        });

        return {
          message: followUpCompletion.choices[0].message.content,
          functionCalls,
        };
      }

      return {
        message: response.content || "I'm here to help! Try asking me about leave, attendance, or use commands like /leave or /attendance.",
        functionCalls: [],
      };
    } catch (error) {
      console.error("AI Chat error:", error);
      return {
        message: "I'm sorry, I encountered an error processing your request. Please try again or contact IT support if the issue persists.",
        functionCalls: [],
      };
    }
  },
});

// Save chat session (unchanged)
export const saveChatSession = mutation({
  args: {
    userId: v.id("users"),
    sessionId: v.string(),
    message: v.string(),
    response: v.string(),
    functionCalls: v.array(v.object({
      name: v.string(),
      arguments: v.string(),
      result: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const existingSession = await ctx.db
      .query("aiChatSessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();

    const newMessage = {
      role: "user" as const,
      content: args.message,
      timestamp: new Date().toISOString(),
    };

    const newResponse = {
      role: "assistant" as const,
      content: args.response,
      timestamp: new Date().toISOString(),
      functionCalls: args.functionCalls.map(fc => ({
        name: fc.name,
        arguments: fc.arguments,
        result: fc.result,
      })),
    };

    if (existingSession) {
      await ctx.db.patch(existingSession._id, {
        messages: [...existingSession.messages, newMessage, newResponse],
      });
    } else {
      await ctx.db.insert("aiChatSessions", {
        userId: args.userId,
        sessionId: args.sessionId,
        messages: [newMessage, newResponse],
        isActive: true,
      });
    }
  },
});

// Get chat history (unchanged)
export const getChatHistory = query({
  args: {
    userId: v.id("users"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("aiChatSessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();

    return session?.messages || [];
  },
});

// Get recent chat sessions (unchanged)
export const getRecentSessions = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("aiChatSessions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .take(10);

    return sessions.map(session => ({
      sessionId: session.sessionId,
      lastMessage: session.messages[session.messages.length - 1]?.content || "",
      timestamp: session._creationTime,
    }));
  },
});

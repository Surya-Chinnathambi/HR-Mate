import { v } from "convex/values";
import { action, query } from "./_generated/server";
import { api } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const generateSmartResponse = action({
  args: {
    prompt: v.string(),
    context: v.string(),
    employeeId: v.id("employees"),
  },
  handler: async (ctx, args) => {
    try {
      // Parse the context to understand what data we have
      const contextData = JSON.parse(args.context);
      
      // Enhanced system prompt for HR Assistant
      const systemPrompt = `You are an AI HR Assistant for a company's HRMS system. You help employees with HR-related tasks through natural language.

Current Employee: ${contextData.employee.name} (${contextData.employee.employeeId})
Department: ${contextData.employee.department}
Designation: ${contextData.employee.designation}

Available Data:
- Leave Balance: ${JSON.stringify(contextData.leaveBalance)}
- Today's Attendance: ${JSON.stringify(contextData.todayAttendance)}
- Team Members: ${contextData.teammates.join(', ')}
- Attendance Stats: ${JSON.stringify(contextData.attendanceStats)}
- Current Time: ${contextData.currentTime}

You can help with:
1. Attendance tracking and clock in/out
2. Leave balance inquiries and applications
3. Team member information
4. Company policies
5. Payroll and salary information
6. General HR queries

Guidelines:
- Be conversational, helpful, and professional
- Use emojis appropriately
- Provide clear, actionable information
- Reference specific data when available
- If you don't have specific data, guide them to the appropriate module
- Always be encouraging and supportive

Respond in a friendly, professional manner with relevant information based on the context provided.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: args.prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0].message.content || "I'm here to help! Could you please rephrase your question?";
    } catch (error) {
      console.error("AI generation error:", error);
      return "I'm experiencing some technical difficulties right now. Please try again in a moment, or feel free to use the specific modules for your HR needs.";
    }
  },
});

export const generateContextualHelp = action({
  args: {
    module: v.string(),
    employeeId: v.id("employees"),
  },
  handler: async (ctx, args): Promise<string> => {
    try {
      const employee: any = await ctx.runQuery(api.employees.getCurrentEmployee);
      
      const moduleHelp: Record<string, string> = {
        attendance: `Hi ${employee?.firstName}! 👋 Here's what you can do in the Attendance module:

• **Clock In/Out**: Track your daily work hours
• **View Records**: See your attendance history
• **Regularization**: Request corrections for missed punches
• **Monthly Summary**: Check your attendance statistics

Quick tip: You can also ask me to "clock in" or "clock out" directly!`,

        leave: `Welcome to Leave Management! 🏖️ Here's how I can help:

• **Apply for Leave**: Submit new leave requests
• **Check Balance**: View remaining leave days
• **Leave History**: See past applications and approvals
• **Leave Types**: Understand different leave policies

Try asking me "show my leave balance" or "apply 2 days casual leave"!`,

        payroll: `Payroll Information Hub 💰 Here's what's available:

• **Salary Slips**: Download monthly payslips
• **Tax Documents**: Access Form 16 and tax statements
• **Salary Structure**: View your compensation breakdown
• **Reimbursements**: Track expense claims

Ask me "show my latest payslip" for quick access!`,

        team: `Team Management 👥 Features:

• **Team Directory**: View all team members
• **Reporting Structure**: See organizational hierarchy
• **Contact Information**: Find colleague details
• **Team Statistics**: Department-wise insights

Try "list my teammates" to see who's in your department!`,
      };

      return moduleHelp[args.module] || 
        `Welcome to the ${args.module} module! I'm here to help you navigate and use all the features effectively. Feel free to ask me any questions!`;
    } catch (error) {
      console.error("Contextual help error:", error);
      return "I'm here to help you with this module! Feel free to ask me any questions about the features available.";
    }
  },
});

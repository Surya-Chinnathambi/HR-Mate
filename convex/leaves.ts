import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getLeaveTypes = query({
  handler: async (ctx) => {
    return await ctx.db.query("leaveTypes").collect();
  },
});

export const getLeaveBalance = query({
  args: {
    employeeId: v.id("employees"),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const balances = await ctx.db
      .query("leaveBalance")
      .withIndex("by_employee_year", (q) =>
        q.eq("employeeId", args.employeeId).eq("year", args.year)
      )
      .collect();

    const leaveTypes = await ctx.db.query("leaveTypes").collect();

    // For each leave type, find the balance record and build the UI object
    return leaveTypes.map((leaveType) => {
      const found = balances.find((b) => String(b.leaveTypeId) === String(leaveType._id));
      const opening = found?.opening ?? 0;
      const accrued = found?.accrued ?? 0;
      const consumed = found?.consumed ?? 0;
      const pending = 0; // You can implement pending logic if needed
      const bal = found?.balance ?? 0;
      const utilization = (opening + accrued) > 0 ? Math.round((consumed / (opening + accrued)) * 100) : 0;
      return {
        leaveType,
        balance: {
          opening,
          accrued,
          consumed,
          balance: bal,
        },
        isLowBalance: bal < 5,
        utilizationPercentage: utilization,
        pendingDays: pending,
      };
    });
  },
});

export const getLeaveBalanceSummary = query({
  args: {
    employeeId: v.id("employees"),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const balances = await ctx.db
      .query("leaveBalance")
      .withIndex("by_employee_year", (q) =>
        q.eq("employeeId", args.employeeId).eq("year", args.year)
      )
      .collect();

    const leaveTypes = await ctx.db.query("leaveTypes").collect();
    const upcomingLeaves = await ctx.db
      .query("leaves")
      .withIndex("by_employeeId", (q) => q.eq("employeeId", args.employeeId))
      .filter((q) => q.eq(q.field("status"), "Approved"))
      .collect();

    const lowBalanceTypes = balances
      .filter(balance => (balance.balance || 0) < 5)
      .map(balance => {
        const leaveType = leaveTypes.find(lt => lt._id === balance.leaveTypeId);
        return {
          leaveType: leaveType || { name: "Unknown" },
          balance: balance.balance || 0
        };
      });

    const totalAvailable = balances.reduce((sum, b) => sum + (b.balance || 0), 0);
    const totalConsumed = balances.reduce((sum, b) => sum + (b.consumed || 0), 0);
    const totalPending = 0; // Simplified for now
    const utilizationRate = totalAvailable > 0 ? Math.round((totalConsumed / (totalAvailable + totalConsumed)) * 100) : 0;

    return {
      lowBalanceTypes,
      upcomingLeaves: upcomingLeaves.slice(0, 3),
      totalBalance: totalAvailable,
      totalAvailable,
      totalConsumed,
      totalPending,
      utilizationRate
    };
  },
});

export const applyLeave = mutation({
  args: {
    employeeId: v.id("employees"),
    leaveType: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the leave type
    const leaveTypeRecord = await ctx.db
      .query("leaveTypes")
      .filter((q) => q.eq(q.field("name"), args.leaveType + " Leave"))
      .first();

    if (!leaveTypeRecord) {
      throw new Error("Invalid leave type");
    }

    // Calculate number of days
    const startDate = new Date(args.startDate);
    const endDate = new Date(args.endDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    // Create leave application (simplified)
    return {
      message: "Leave application submitted successfully",
      applicationId: `LEAVE_${Date.now()}`,
      days: daysDiff,
      status: "Pending Approval"
    };
  },
});

export const approveRequest = mutation({
  args: {
    requestId: v.string(),
    type: v.string(),
    comments: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return {
      success: true,
      message: "Request approved successfully"
    };
  },
});

export const rejectRequest = mutation({
  args: {
    requestId: v.string(),
    type: v.string(),
    comments: v.string(),
  },
  handler: async (ctx, args) => {
    return {
      success: true,
      message: "Request rejected successfully"
    };
  },
});

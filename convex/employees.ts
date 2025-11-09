import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCurrentEmployee = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("employees")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

export const getEmployeeByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("employees")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

export const getTeammates = query({
  args: { 
    department: v.string(),
    excludeId: v.optional(v.id("employees"))
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("employees")
      .withIndex("by_department", (q) => q.eq("department", args.department));
    
    const teammates = await query.collect();
    
    // Filter out the current employee if excludeId is provided
    return teammates.filter(emp => emp._id !== args.excludeId);
  },
});

export const getOrganizationTree = query({
  handler: async (ctx) => {
    const employees = await ctx.db.query("employees").collect();
    const departments: Record<string, any[]> = {};
    for (const emp of employees) {
      if (!emp.department) continue;
      if (!departments[emp.department]) {
        departments[emp.department] = [];
      }
      departments[emp.department].push(emp);
    }

    return Object.entries(departments).map(([department, employees]) => ({
      department,
      count: employees.length,
      employees,
    }));
  },
});

export const updateEmployeeProfile = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.object({
        street: v.string(),
        city: v.string(),
        state: v.string(),
        zip: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const employee = await ctx.db
      .query("employees")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!employee) {
      throw new Error("Employee not found");
    }

    await ctx.db.patch(employee._id, args);
  },
});

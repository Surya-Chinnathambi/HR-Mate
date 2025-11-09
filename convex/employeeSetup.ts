import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createCurrentEmployee = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if employee already exists
    const existingEmployee = await ctx.db
      .query("employees")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existingEmployee) {
      return existingEmployee._id;
    }

    // Get user info from auth
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    // Create employee record
    const employeeId = await ctx.db.insert("employees", {
      userId,
      employeeId: `EMP${Date.now()}`,
      firstName: user.name?.split(' ')[0] || "John",
      lastName: user.name?.split(' ')[1] || "Doe",
      email: user.email || "employee@company.com",
      designation: "Software Engineer",
      department: "Engineering",
      status: "Active",
      location: "Office",
      joiningDate: new Date().toISOString().split('T')[0],
      businessUnit: "Technology",
    });

    return employeeId;
  },
});

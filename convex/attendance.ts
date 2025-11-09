import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getTodayAttendance = query({
  args: { employeeId: v.id("employees") },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split('T')[0];
    return await ctx.db
      .query("attendance")
      .withIndex("by_employeeId_and_date", (q) => 
        q.eq("employeeId", args.employeeId).eq("date", today)
      )
      .unique();
  },
});

export const getAttendanceRange = query({
  args: {
    employeeId: v.id("employees"),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const attendance = await ctx.db
      .query("attendance")
      .withIndex("by_employeeId_and_date", (q) => q.eq("employeeId", args.employeeId))
      .filter((q) => 
        q.and(
          q.gte(q.field("date"), args.startDate),
          q.lte(q.field("date"), args.endDate)
        )
      )
      .collect();
    
    return attendance;
  },
});

export const checkIn = mutation({
  args: {
    employeeId: v.id("employees"),
    checkInTime: v.string(),
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if already clocked in today
    const existing = await ctx.db
      .query("attendance")
      .withIndex("by_employeeId_and_date", (q) => 
        q.eq("employeeId", args.employeeId).eq("date", today)
      )
      .unique();
    
    if (existing) {
      throw new Error("Already clocked in today");
    }
    
    return await ctx.db.insert("attendance", {
      employeeId: args.employeeId,
      date: today,
      checkIn: args.checkInTime,
      status: "Present",
      workHours: 0,
    });
  },
});

export const checkOut = mutation({
  args: {
    employeeId: v.id("employees"),
    checkOutTime: v.string(),
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split('T')[0];
    
    const attendance = await ctx.db
      .query("attendance")
      .withIndex("by_employeeId_and_date", (q) => 
        q.eq("employeeId", args.employeeId).eq("date", today)
      )
      .unique();
    
    if (!attendance) {
      throw new Error("No check-in record found for today");
    }
    
    if (attendance.checkOut) {
      throw new Error("Already clocked out today");
    }
    
    // Calculate work hours
    const checkInTime = new Date(`${today}T${attendance.checkIn}:00`);
    const checkOutTime = new Date(`${today}T${args.checkOutTime}:00`);
    const workHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    
    return await ctx.db.patch(attendance._id, {
      checkOut: args.checkOutTime,
      workHours: Math.round(workHours * 100) / 100,
    });
  },
});

export const clockIn = mutation({
  args: {
    employeeId: v.id("employees"),
    location: v.optional(v.object({
      latitude: v.number(),
      longitude: v.number(),
      accuracy: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const timeString = now.toTimeString().slice(0, 5);
    
    // Check if already clocked in today
    const existing = await ctx.db
      .query("attendance")
      .withIndex("by_employeeId_and_date", (q) => 
        q.eq("employeeId", args.employeeId).eq("date", today)
      )
      .unique();
    
    if (existing && existing.checkIn) {
      throw new Error("Already clocked in today");
    }
    
    if (existing) {
      return await ctx.db.patch(existing._id, {
        checkIn: timeString,
        status: "Present",
      });
    }
    
    return await ctx.db.insert("attendance", {
      employeeId: args.employeeId,
      date: today,
      checkIn: timeString,
      status: "Present",
      workHours: 0,
    });
  },
});

export const clockOut = mutation({
  args: {
    employeeId: v.id("employees"),
    location: v.optional(v.object({
      latitude: v.number(),
      longitude: v.number(),
      accuracy: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const timeString = now.toTimeString().slice(0, 5);
    
    const attendance = await ctx.db
      .query("attendance")
      .withIndex("by_employeeId_and_date", (q) => 
        q.eq("employeeId", args.employeeId).eq("date", today)
      )
      .unique();
    
    if (!attendance || !attendance.checkIn) {
      throw new Error("No check-in record found for today");
    }
    
    if (attendance.checkOut) {
      throw new Error("Already clocked out today");
    }
    
    // Calculate work hours
    const checkInTime = new Date(`${today}T${attendance.checkIn}:00`);
    const checkOutTime = new Date(`${today}T${timeString}:00`);
    const workHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    
    return await ctx.db.patch(attendance._id, {
      checkOut: timeString,
      workHours: Math.round(workHours * 100) / 100,
    });
  },
});

export const applyRegularization = mutation({
  args: {
    employeeId: v.id("employees"),
    date: v.string(),
    reason: v.string(),
    requestedCheckIn: v.optional(v.string()),
    requestedCheckOut: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // This would create a regularization request
    // For now, we'll just return a success message
    return {
      message: "Regularization request submitted successfully",
      requestId: `REG_${Date.now()}`,
    };
  },
});

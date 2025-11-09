import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

// Get all real-time notifications for the current user
export const getNotifications = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { unreadCount: 0, notifications: [] };

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(100);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return {
      unreadCount,
      notifications,
    };
  },
});

// Get inbox items for the current user
export const getInboxItems = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const items = await ctx.db
      .query("inboxItems")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return items;
  },
});

// Mark notification as read
export const markNotificationRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.userId !== userId) {
      throw new Error("Notification not found");
    }

    await ctx.db.patch(args.notificationId, { isRead: true });
  },
});

// Get dashboard summary data
export const getDashboardSummary = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const employee = await ctx.db
      .query("employees")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!employee) return null;

    const today = new Date().toISOString().split("T")[0];

    const todayAttendance = await ctx.db
      .query("attendance")
      .withIndex("by_employeeId_and_date", (q) =>
        q.eq("employeeId", employee._id).eq("date", today)
      )
      .unique();

    const upcomingHolidays = await ctx.db
      .query("holidays")
      .filter((q) => q.gte(q.field("date"), today))
      .order("asc")
      .take(2);

    const teamOnLeave = await ctx.db
      .query("leaves")
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "Approved"),
          q.lte(q.field("startDate"), today),
          q.gte(q.field("endDate"), today)
        )
      )
      .collect();

    const remoteWork = await ctx.db
      .query("attendance")
      .withIndex("by_date", (q) => q.eq("date", today))
      .filter((q) => q.eq(q.field("isRemote"), true))
      .collect();

    const announcements = await ctx.db
      .query("announcements")
      .order("desc")
      .take(3);

    return {
      attendance: {
        status: todayAttendance?.status || "Absent",
        checkIn: todayAttendance?.checkIn,
        checkOut: todayAttendance?.checkOut,
        workHours: todayAttendance?.workHours || 0,
        workLocation: employee.location || "office",
      },
      upcomingHolidays,
      teamOnLeaveCount: teamOnLeave.length,
      remoteWorkCount: remoteWork.length,
      announcements,
    };
  },
});

// Get team summary for a manager
export const getTeamSummary = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const employee = await ctx.db
      .query("employees")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!employee) return null;

    const teamMembers = await ctx.db
      .query("employees")
      .withIndex("by_department", (q) => q.eq("department", employee.department))
      .collect();

    const today = new Date().toISOString().split("T")[0];

    const teamAttendance = await ctx.db
      .query("attendance")
      .withIndex("by_date", (q) => q.eq("date", today))
      .collect();

    const teamAttendanceMap = new Map(
      teamAttendance.map((a) => [a.employeeId, a])
    );

    const summary = teamMembers.map((member) => ({
      ...member,
      attendanceStatus: teamAttendanceMap.get(member._id)?.status || "Absent",
    }));

    const onLeave = summary.filter(
      (s) => s.attendanceStatus === "On Leave"
    ).length;
    const wfh = summary.filter(
      (s) => teamAttendanceMap.get(s._id)?.isRemote
    ).length;
    const present = summary.filter(
      (s) => s.attendanceStatus === "Present"
    ).length;

    return {
      team: summary,
      stats: {
        total: summary.length,
        onLeave,
        wfh,
        present,
      },
    };
  },
});

// Get employee directory with filters
export const getEmployeeDirectory = query({
  args: {
    department: v.optional(v.string()),
    location: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let employees = await ctx.db.query("employees").collect();

    if (args.department) {
      employees = employees.filter(
        (emp) => emp.department === args.department
      );
    }
    if (args.location) {
      employees = employees.filter((emp) => emp.location === args.location);
    }
    if (args.search) {
      const searchTerm = args.search.toLowerCase();
      employees = employees.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(searchTerm) ||
          emp.lastName.toLowerCase().includes(searchTerm) ||
          emp.designation.toLowerCase().includes(searchTerm)
      );
    }

    const allEmployees = await ctx.db.query("employees").collect();
    const departments = [...new Set(allEmployees.map((emp) => emp.department))];
    const locations = [...new Set(allEmployees.map((emp) => emp.location).filter(Boolean))];

    return {
      employees,
      filters: {
        departments,
        locations,
      },
    };
  },
});

// Get leave calendar data for the team
export const getTeamLeaveCalendar = query({
  args: { employeeId: v.id("employees") },
  handler: async (ctx, args) => {
    const manager = await ctx.db.get(args.employeeId);
    if (!manager) return [];

    const teamMembers = await ctx.db
      .query("employees")
      .withIndex("by_department", (q) => q.eq("department", manager.department))
      .collect();

    const teamIds = teamMembers.map((m) => m._id);

    const leaves = await ctx.db
      .query("leaves")
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "Approved"),
          //@ts-ignore
          q.in(q.field("employeeId"), teamIds)
        )
      )
      .collect();

    // Get leave types
    const leaveTypes = await ctx.db.query("leaveTypes").collect();
    const leaveTypeMap = new Map(leaveTypes.map(lt => [lt._id, lt]));

    return leaves.map((leave) => {
      const employee = teamMembers.find((m) => m._id === leave.employeeId);
      const leaveType = leave.leaveTypeId ? leaveTypeMap.get(leave.leaveTypeId) : undefined;
      return {
        title: `${employee?.firstName} ${employee?.lastName}`,
        start: leave.startDate,
        end: leave.endDate,
        allDay: true,
        extendedProps: {
          leaveType: leaveType?.name,
        },
      };
    });
  },
});

// Get monthly work summary for an employee
export const getMonthlyWorkSummary = query({
  args: {
    employeeId: v.id("employees"),
    month: v.number(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const attendance = await ctx.db
      .query("attendance")
      .withIndex("by_employeeId", (q) => q.eq("employeeId", args.employeeId))
      .collect();

    const filteredAttendance = attendance.filter((att) => {
      const date = new Date(att.date);
      return date.getMonth() + 1 === args.month && date.getFullYear() === args.year;
    });

    const totalHours = filteredAttendance.reduce(
      (sum, att) => sum + (att.workHours || 0),
      0
    );
    const totalDays = filteredAttendance.length;
    const avgHours = totalDays > 0 ? totalHours / totalDays : 0;

    return {
      totalHours: Math.round(totalHours * 100) / 100,
      totalDays,
      avgHours: Math.round(avgHours * 100) / 100,
    };
  },
});

export const getAttendanceStats = query({
  args: { employeeId: v.id("employees"), month: v.string(), year: v.number() },
  handler: async (ctx, args) => {
    const attendance = await ctx.db.query("attendance").withIndex("by_employeeId", (q) => q.eq("employeeId", args.employeeId)).collect();
    const monthNum = parseInt(args.month);
    const filtered = attendance.filter((att) => {
      const date = new Date(att.date);
      return date.getMonth() + 1 === monthNum && date.getFullYear() === args.year;
    });
    const present = filtered.filter(a => a.status === "Present").length;
    return { present, absent: filtered.length - present, totalDays: filtered.length, attendancePercentage: filtered.length > 0 ? (present / filtered.length) * 100 : 0 };
  },
});

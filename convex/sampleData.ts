import { mutation, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

export const initializeSampleData = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      console.log("User not authenticated. Cannot schedule sample data initialization.");
      return;
    }
    await ctx.scheduler.runAfter(0, internal.sampleData.initializeSampleDataInternal, { userId });
  },
});

export const initializeSampleDataInternal = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    if (!userId) {
      console.log("User ID not provided. Skipping sample data initialization.");
      return;
    }

    const currentEmployee = await ctx.db
      .query("employees")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!currentEmployee) {
      console.error("Current employee not found. Cannot initialize sample data.");
      return;
    }

    // Check if sample data already exists (quick optimization)
    const existingSampleEmployee = await ctx.db
      .query("employees")
      .withIndex("by_employeeId", (q) => q.eq("employeeId", "EMP789012"))
      .first();
    
    if (existingSampleEmployee) {
      console.log("Sample data already initialized. Skipping.");
      return;
    }

    // --- Create Sample Team Members ---
    const teammatesData = [
        { employeeId: "EMP789012", firstName: "Alex", lastName: "Johnson", email: "alex.j@example.com", phone: "555-0101", department: "Technology", designation: "Senior Developer", joiningDate: "2021-08-15", salary: 95000, status: "active", location: "Remote", businessUnit: "Core Platform", address: { street: "456 Oak Ave", city: "Techville", state: "CA", zip: "90211" }, bankDetails: { bankName: "First Tech Bank", accountNumber: "9876543210", ifscCode: "FTB000001" } },
        { employeeId: "EMP345678", firstName: "Brenda", lastName: "Smith", email: "brenda.s@example.com", phone: "555-0102", department: "Technology", designation: "UI/UX Designer", joiningDate: "2022-03-20", salary: 82000, status: "active", location: "Office", businessUnit: "Product", address: { street: "789 Pine St", city: "Designburg", state: "TX", zip: "75001" }, bankDetails: { bankName: "Creative Union", accountNumber: "1234509876", ifscCode: "CU0000002" } },
        { employeeId: "EMP901234", firstName: "Charles", lastName: "Brown", email: "charles.b@example.com", phone: "555-0103", department: "HR", designation: "HR Manager", joiningDate: "2020-11-01", salary: 88000, status: "active", location: "Office", businessUnit: "People Ops", address: { street: "101 Maple Dr", city: "HR City", state: "NY", zip: "10001" }, bankDetails: { bankName: "People's Bank", accountNumber: "5432167890", ifscCode: "PB0000003" } },
    ];

    for (const teammate of teammatesData) {
      const existing = await ctx.db
        .query("employees")
        .withIndex("by_employeeId", (q) => q.eq("employeeId", teammate.employeeId))
        .unique();
      if (!existing) {
        // These are sample employees that don't have user accounts
        await ctx.db.insert("employees", teammate);
      }
    }

    // --- Create Sample Holidays ---
    const holidaysData = [
        { date: "2024-12-25", name: "Christmas Day", type: "national" as const, isActive: true },
        { date: "2025-01-01", name: "New Year's Day", type: "national" as const, isActive: true },
    ];

    for (const holiday of holidaysData) {
      const existing = await ctx.db.query("holidays").withIndex("by_date", (q) => q.eq("date", holiday.date)).unique();
      if (!existing) {
        await ctx.db.insert("holidays", holiday);
      }
    }

    // --- Create Sample Announcements ---
    const announcementsData = [
        { title: "Annual Performance Review Cycle", content: "The annual performance review cycle for 2024 will commence on December 1st. Please complete your self-assessment by December 15th.", publishDate: "2024-11-20", type: "general" as const, audience: "all" as const, isActive: true, createdBy: userId },
        { title: "Holiday Party Announcement", content: "Join us for the annual holiday party on December 20th at 6 PM in the main cafeteria. RSVP by December 10th.", publishDate: "2024-11-18", type: "event" as const, audience: "all" as const, isActive: true, createdBy: userId },
    ];

    for (const announcement of announcementsData) {
      const existing = await ctx.db
        .query("announcements")
        .filter((q) => q.eq(q.field("title"), announcement.title))
        .first();
      if (!existing) {
        await ctx.db.insert("announcements", announcement);
      }
    }

    // --- Create Sample Notifications ---
    const notificationsData = [
        { title: "Welcome to HRMS Pro!", message: "Your account has been successfully set up. Explore the dashboard to get started.", type: "info" as const, isRead: false, priority: "high" as const },
        { title: "Policy Update: Remote Work", message: "The company remote work policy has been updated. Please review the new guidelines in the policies section.", type: "info" as const, isRead: false, priority: "medium" as const },
    ];

    for (const notification of notificationsData) {
        await ctx.db.insert("notifications", { ...notification, userId });
    }

    // --- Create Sample Leave Types ---
    const leaveTypesData = [
      {
        name: "Casual Leave",
        code: "CL",
        accrualRule: { type: "yearly" as const, amount: 12, maxBalance: 15 },
        carryForwardRule: { enabled: true, maxDays: 5, expiryMonths: 3 },
        encashmentRule: { enabled: false },
        sandwichRule: false,
        partialDayAllowed: true,
        halfDayAllowed: true,
        isActive: true,
      },
      {
        name: "Sick Leave",
        code: "SL",
        accrualRule: { type: "yearly" as const, amount: 7, maxBalance: 10 },
        carryForwardRule: { enabled: false },
        encashmentRule: { enabled: false },
        sandwichRule: false,
        partialDayAllowed: true,
        halfDayAllowed: true,
        isActive: true,
      },
      {
        name: "Earned Leave",
        code: "EL",
        accrualRule: { type: "monthly" as const, amount: 1.25, maxBalance: 30 },
        carryForwardRule: { enabled: true, maxDays: 15, expiryMonths: 12 },
        encashmentRule: { enabled: true, minBalance: 10, maxDays: 10 },
        sandwichRule: true,
        partialDayAllowed: false,
        halfDayAllowed: false,
        isActive: true,
      },
    ];

    for (const leaveType of leaveTypesData) {
      const existing = await ctx.db
        .query("leaveTypes")
        .withIndex("by_code", (q) => q.eq("code", leaveType.code))
        .first();
      if (!existing) {
        await ctx.db.insert("leaveTypes", leaveType);
      }
    }

    // --- Create Sample Leave Balance ---
    const currentYear = new Date().getFullYear();
    const leaveTypes = await ctx.db.query("leaveTypes").collect();
    
    for (const leaveType of leaveTypes) {
      const existingBalance = await ctx.db
        .query("leaveBalance")
        .withIndex("by_employee_year", (q) => 
          q.eq("employeeId", currentEmployee._id).eq("year", currentYear)
        )
        .filter((q) => q.eq(q.field("leaveTypeId"), leaveType._id))
        .first();
        
      if (!existingBalance) {
        await ctx.db.insert("leaveBalance", {
          employeeId: currentEmployee._id,
          leaveTypeId: leaveType._id,
          year: currentYear,
          opening: 0,
          accrued: leaveType.accrualRule.amount,
          consumed: 0,
          encashed: 0,
          lapsed: 0,
          balance: leaveType.accrualRule.amount,
        });
      }
    }

    // --- Create Sample Attendance Data ---
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const existingAttendance = await ctx.db.query("attendance").withIndex("by_employeeId_and_date", (q) => q.eq("employeeId", currentEmployee._id).eq("date", dateStr)).unique();
      if (existingAttendance) continue;

      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends

      const checkIn = new Date(date);
      checkIn.setHours(9, Math.floor(Math.random() * 30), 0, 0);
      const checkOut = new Date(date);
      checkOut.setHours(17, 30 + Math.floor(Math.random() * 30), 0, 0);
      const workHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);

      await ctx.db.insert("attendance", {
        employeeId: currentEmployee._id,
        date: dateStr,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        status: "Present",
        workHours: Math.round(workHours * 100) / 100,
      });
    }

    console.log("Sample data initialization complete.");
  },
});

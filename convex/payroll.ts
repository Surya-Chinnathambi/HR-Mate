import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Generate payslip for an employee for a specific month
export const generatePayroll = mutation({
  args: {
    employeeId: v.id("employees"),
    month: v.number(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const employee = await ctx.db.get(args.employeeId);
    if (!employee) throw new Error("Employee not found");

    const basicSalary = employee.salary || 0;
    const hra = basicSalary * 0.4;
    const allowances = basicSalary * 0.1;
    const grossSalary = basicSalary + hra + allowances;
    
    const pf = basicSalary * 0.12;
    const tax = basicSalary * 0.1;
    const totalDeductions = pf + tax;
    const netSalary = grossSalary - totalDeductions;
    
    const payPeriod = `${args.year}-${String(args.month).padStart(2, "0")}`;

    const existingPayslip = await ctx.db
      .query("payslips")
      .withIndex("by_employeeId", (q) => q.eq("employeeId", args.employeeId))
      .filter((q) => q.eq(q.field("period"), payPeriod))
      .first();
      
    if (existingPayslip) {
      throw new Error("Payslip already generated for this period.");
    }

    // Create a dummy payroll run if needed
    let payrollRun = await ctx.db
      .query("payrollRuns")
      .filter((q) => 
        q.and(
          q.eq(q.field("periodStart"), `${payPeriod}-01`),
          q.eq(q.field("periodEnd"), `${payPeriod}-28`)
        )
      )
      .first();

    if (!payrollRun) {
      const runId = await ctx.db.insert("payrollRuns", {
        name: `Payroll ${payPeriod}`,
        periodStart: `${payPeriod}-01`,
        periodEnd: `${payPeriod}-28`,
        status: "Finalized",
        totalEmployees: 1,
        totalGross: grossSalary,
        totalDeductions,
        totalNet: netSalary,
        processedBy: userId,
        processedDate: new Date().toISOString().split('T')[0],
      });
      payrollRun = await ctx.db.get(runId);
    }

    if (!payrollRun) throw new Error("Failed to create payroll run");

    const payslipId = await ctx.db.insert("payslips", {
      employeeId: args.employeeId,
      runId: payrollRun._id,
      period: payPeriod,
      earnings: {
        basic: basicSalary,
        hra,
        allowances,
        overtime: 0,
        bonus: 0,
        total: grossSalary,
      },
      deductions: {
        pf,
        esi: 0,
        tax,
        loan: 0,
        other: 0,
        total: totalDeductions,
      },
      netPay: netSalary,
      workingDays: 22,
      presentDays: 22,
      lopDays: 0,
      overtimeHours: 0,
      ytdEarnings: grossSalary,
      ytdDeductions: totalDeductions,
      ytdNet: netSalary,
    });

    return await ctx.db.get(payslipId);
  },
});

// Get payroll history for an employee
export const getPayrollHistory = query({
  args: {
    employeeId: v.optional(v.id("employees")),
    month: v.optional(v.number()),
    year: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let payslips = await ctx.db.query("payslips").collect();

    if (args.employeeId) {
      payslips = payslips.filter((p) => p.employeeId === args.employeeId);
    }

    if (args.month && args.year) {
      const payPeriod = `${args.year}-${String(args.month).padStart(2, "0")}`;
      payslips = payslips.filter((p) => p.period === payPeriod);
    }

    return payslips.sort((a, b) => b.period.localeCompare(a.period));
  },
});

// Update payroll status
export const updatePayrollStatus = mutation({
  args: {
    runId: v.id("payrollRuns"),
    status: v.union(
      v.literal("Draft"),
      v.literal("Processing"),
      v.literal("Validated"),
      v.literal("Finalized"),
      v.literal("Paid")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.runId, { status: args.status });
  },
});

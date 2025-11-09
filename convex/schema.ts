import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Core Employee Management
  employees: defineTable({
    userId: v.optional(v.id("users")),
    employeeId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    designation: v.string(),
    department: v.string(),
    managerId: v.optional(v.id("employees")),
    locationId: v.optional(v.id("locations")),
    shiftId: v.optional(v.id("shifts")),
    imageUrl: v.optional(v.string()),
    salary: v.optional(v.number()),
    ctc: v.optional(v.number()),
    status: v.optional(v.string()),
    location: v.optional(v.string()),
    joiningDate: v.optional(v.string()),
    businessUnit: v.optional(v.string()),
    timezone: v.optional(v.string()),
    address: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
    })),
    bankDetails: v.optional(v.object({
      bankName: v.string(),
      accountNumber: v.string(),
      ifscCode: v.string(),
    })),
    phone: v.optional(v.string()),
    emergencyContact: v.optional(v.object({
      name: v.string(),
      relationship: v.string(),
      phone: v.string(),
    })),
    // Audit fields
    createdBy: v.optional(v.id("users")),
    updatedBy: v.optional(v.id("users")),
    isDeleted: v.optional(v.boolean()),
  }).index("by_userId", ["userId"])
    .index("by_department", ["department"])
    .index("by_employeeId", ["employeeId"])
    .index("by_managerId", ["managerId"])
    .index("by_locationId", ["locationId"])
    .index("by_status", ["status"]),

  // Organization Structure
  departments: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    headId: v.optional(v.id("employees")),
    parentId: v.optional(v.id("departments")),
    costCenter: v.optional(v.string()),
    isActive: v.boolean(),
  }).index("by_parentId", ["parentId"]),

  locations: defineTable({
    name: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    country: v.string(),
    timezone: v.string(),
    isActive: v.boolean(),
  }),

  // Shift Management
  shifts: defineTable({
    name: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    breakDuration: v.number(), // minutes
    weeklyOffDays: v.array(v.number()), // 0=Sunday, 1=Monday, etc.
    graceMinutes: v.number(),
    overtimeThreshold: v.number(), // minutes
    isFlexible: v.boolean(),
    locationId: v.optional(v.id("locations")),
    isActive: v.boolean(),
  }).index("by_locationId", ["locationId"]),

  // Enhanced Attendance
  attendance: defineTable({
    employeeId: v.id("employees"),
    date: v.string(),
    shiftId: v.optional(v.id("shifts")),
    checkIn: v.optional(v.string()),
    checkOut: v.optional(v.string()),
    status: v.union(
      v.literal("Present"),
      v.literal("Absent"),
      v.literal("On Leave"),
      v.literal("Holiday"),
      v.literal("Half Day"),
      v.literal("Late"),
      v.literal("Early Out"),
      v.literal("WFH")
    ),
    workHours: v.optional(v.number()),
    overtimeMinutes: v.optional(v.number()),
    breakMinutes: v.optional(v.number()),
    isRemote: v.optional(v.boolean()),
    ipAddress: v.optional(v.string()),
    location: v.optional(v.object({
      latitude: v.number(),
      longitude: v.number(),
      accuracy: v.number(),
    })),
    source: v.optional(v.union(
      v.literal("web"),
      v.literal("mobile"),
      v.literal("biometric"),
      v.literal("manual")
    )),
    notes: v.optional(v.string()),
    regularizationId: v.optional(v.id("attendanceRegularizations")),
    // Audit fields
    createdBy: v.optional(v.id("users")),
    updatedBy: v.optional(v.id("users")),
  }).index("by_employeeId_and_date", ["employeeId", "date"])
    .index("by_employeeId", ["employeeId"])
    .index("by_date", ["date"])
    .index("by_status", ["status"]),

  // Attendance Regularization
  attendanceRegularizations: defineTable({
    employeeId: v.id("employees"),
    date: v.string(),
    requestedCheckIn: v.optional(v.string()),
    requestedCheckOut: v.optional(v.string()),
    reason: v.string(),
    status: v.union(
      v.literal("Pending"),
      v.literal("Approved"),
      v.literal("Rejected")
    ),
    approverId: v.optional(v.id("employees")),
    approverComments: v.optional(v.string()),
    appliedDate: v.string(),
    processedDate: v.optional(v.string()),
  }).index("by_employeeId", ["employeeId"])
    .index("by_status", ["status"])
    .index("by_approverId", ["approverId"]),

  // Overtime Management
  overtimePolicies: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    calculationRule: v.union(
      v.literal("fixed_rate"),
      v.literal("multiplier"),
      v.literal("comp_off")
    ),
    payRate: v.optional(v.number()),
    multiplier: v.optional(v.number()),
    minThresholdMinutes: v.number(),
    maxCapMinutes: v.optional(v.number()),
    compOffEnabled: v.boolean(),
    autoApproval: v.boolean(),
    isActive: v.boolean(),
  }),

  overtimeAllocations: defineTable({
    employeeId: v.id("employees"),
    policyId: v.id("overtimePolicies"),
    allocatedMinutes: v.number(),
    consumedMinutes: v.number(),
    period: v.string(), // YYYY-MM
    isActive: v.boolean(),
  }).index("by_employeeId", ["employeeId"])
    .index("by_period", ["period"]),

  // Enhanced Leave Management
  leaveTypes: defineTable({
    name: v.string(),
    code: v.string(),
    description: v.optional(v.string()),
    accrualRule: v.object({
      type: v.union(v.literal("monthly"), v.literal("yearly"), v.literal("none")),
      amount: v.number(),
      maxBalance: v.optional(v.number()),
    }),
    carryForwardRule: v.object({
      enabled: v.boolean(),
      maxDays: v.optional(v.number()),
      expiryMonths: v.optional(v.number()),
    }),
    encashmentRule: v.object({
      enabled: v.boolean(),
      minBalance: v.optional(v.number()),
      maxDays: v.optional(v.number()),
    }),
    sandwichRule: v.boolean(),
    partialDayAllowed: v.boolean(),
    halfDayAllowed: v.boolean(),
    minDays: v.optional(v.number()),
    maxDays: v.optional(v.number()),
    advanceBookingDays: v.optional(v.number()),
    restrictedDates: v.optional(v.array(v.string())),
    isActive: v.boolean(),
  }).index("by_code", ["code"]),

  leaveBalance: defineTable({
    employeeId: v.id("employees"),
    leaveTypeId: v.optional(v.id("leaveTypes")),
    year: v.number(),
    opening: v.optional(v.number()),
    accrued: v.optional(v.number()),
    consumed: v.optional(v.number()),
    encashed: v.optional(v.number()),
    lapsed: v.optional(v.number()),
    balance: v.optional(v.number()),
    // Legacy fields
    casual: v.optional(v.number()),
    sick: v.optional(v.number()),
    earned: v.optional(v.number()),
  }).index("by_employee_year", ["employeeId", "year"])
    .index("by_leaveTypeId", ["leaveTypeId"]),

  leaves: defineTable({
    employeeId: v.id("employees"),
    leaveTypeId: v.optional(v.id("leaveTypes")),
    leaveType: v.optional(v.string()), // Legacy field
    startDate: v.string(),
    endDate: v.string(),
    totalDays: v.optional(v.number()),
    partialDay: v.optional(v.union(
      v.literal("first_half"),
      v.literal("second_half")
    )),
    reason: v.string(),
    status: v.union(
      v.literal("Draft"),
      v.literal("Pending"),
      v.literal("Approved"),
      v.literal("Rejected"),
      v.literal("Cancelled")
    ),
    approverId: v.optional(v.id("employees")),
    approverComments: v.optional(v.string()),
    appliedDate: v.string(),
    processedDate: v.optional(v.string()),
    attachments: v.optional(v.array(v.string())),
    // Audit fields
    createdBy: v.optional(v.id("users")),
    updatedBy: v.optional(v.id("users")),
  }).index("by_employeeId", ["employeeId"])
    .index("by_status", ["status"])
    .index("by_approverId", ["approverId"])
    .index("by_leaveTypeId", ["leaveTypeId"]),

  // Timesheet Management
  projects: defineTable({
    name: v.string(),
    code: v.string(),
    description: v.optional(v.string()),
    clientName: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    utilizationTarget: v.optional(v.number()),
    isBillable: v.boolean(),
    isActive: v.boolean(),
    managerId: v.optional(v.id("employees")),
  }).index("by_code", ["code"])
    .index("by_managerId", ["managerId"]),

  tasks: defineTable({
    projectId: v.id("projects"),
    name: v.string(),
    description: v.optional(v.string()),
    estimatedHours: v.optional(v.number()),
    isBillable: v.boolean(),
    isActive: v.boolean(),
  }).index("by_projectId", ["projectId"]),

  timesheetEntries: defineTable({
    employeeId: v.id("employees"),
    projectId: v.id("projects"),
    taskId: v.optional(v.id("tasks")),
    date: v.string(),
    hours: v.number(),
    description: v.optional(v.string()),
    isBillable: v.boolean(),
    status: v.union(
      v.literal("Draft"),
      v.literal("Submitted"),
      v.literal("Approved"),
      v.literal("Rejected")
    ),
    approverId: v.optional(v.id("employees")),
    weekStart: v.string(),
  }).index("by_employeeId", ["employeeId"])
    .index("by_projectId", ["projectId"])
    .index("by_weekStart", ["weekStart"])
    .index("by_status", ["status"]),

  // Expense Management
  expenseCategories: defineTable({
    name: v.string(),
    code: v.string(),
    description: v.optional(v.string()),
    maxAmount: v.optional(v.number()),
    requiresReceipt: v.boolean(),
    isActive: v.boolean(),
  }),

  expenseClaims: defineTable({
    employeeId: v.id("employees"),
    categoryId: v.id("expenseCategories"),
    amount: v.number(),
    currency: v.string(),
    description: v.string(),
    expenseDate: v.string(),
    receiptUrl: v.optional(v.string()),
    status: v.union(
      v.literal("Draft"),
      v.literal("Submitted"),
      v.literal("Approved"),
      v.literal("Rejected"),
      v.literal("Paid")
    ),
    approverId: v.optional(v.id("employees")),
    approverComments: v.optional(v.string()),
    appliedDate: v.string(),
    processedDate: v.optional(v.string()),
  }).index("by_employeeId", ["employeeId"])
    .index("by_status", ["status"])
    .index("by_approverId", ["approverId"]),

  // Enhanced Payroll
  payrollRuns: defineTable({
    name: v.string(),
    periodStart: v.string(),
    periodEnd: v.string(),
    status: v.union(
      v.literal("Draft"),
      v.literal("Processing"),
      v.literal("Validated"),
      v.literal("Finalized"),
      v.literal("Paid")
    ),
    totalEmployees: v.number(),
    totalGross: v.number(),
    totalDeductions: v.number(),
    totalNet: v.number(),
    processedBy: v.id("users"),
    processedDate: v.optional(v.string()),
  }).index("by_status", ["status"]),

  payslips: defineTable({
    employeeId: v.id("employees"),
    runId: v.id("payrollRuns"),
    period: v.string(),
    earnings: v.object({
      basic: v.number(),
      hra: v.number(),
      allowances: v.number(),
      overtime: v.number(),
      bonus: v.number(),
      total: v.number(),
    }),
    deductions: v.object({
      pf: v.number(),
      esi: v.number(),
      tax: v.number(),
      loan: v.number(),
      other: v.number(),
      total: v.number(),
    }),
    netPay: v.number(),
    workingDays: v.number(),
    presentDays: v.number(),
    lopDays: v.number(),
    overtimeHours: v.number(),
    ytdEarnings: v.number(),
    ytdDeductions: v.number(),
    ytdNet: v.number(),
  }).index("by_employeeId", ["employeeId"])
    .index("by_runId", ["runId"]),

  // Performance Management
  performanceGoals: defineTable({
    employeeId: v.id("employees"),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    metric: v.optional(v.string()),
    target: v.optional(v.string()),
    weight: v.optional(v.number()),
    status: v.union(
      v.literal("Draft"),
      v.literal("Active"),
      v.literal("Completed"),
      v.literal("Cancelled")
    ),
    progress: v.number(),
    startDate: v.string(),
    endDate: v.string(),
    reviewerId: v.optional(v.id("employees")),
  }).index("by_employeeId", ["employeeId"])
    .index("by_reviewerId", ["reviewerId"]),

  reviewCycles: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.string(),
    status: v.union(
      v.literal("Draft"),
      v.literal("Active"),
      v.literal("Completed")
    ),
    templateId: v.optional(v.string()),
  }),

  // Enhanced Notifications & Inbox
  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.optional(v.string()),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    isRead: v.boolean(),
    actionUrl: v.optional(v.string()),
    actionLabel: v.optional(v.string()),
    metadata: v.optional(v.object({
      entityType: v.optional(v.string()),
      entityId: v.optional(v.string()),
      requestId: v.optional(v.string()),
    })),
    expiresAt: v.optional(v.string()),
  }).index("by_userId", ["userId"])
    .index("by_type", ["type"])
    .index("by_priority", ["priority"]),

  inboxItems: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    type: v.union(
      v.literal("leave_approval"),
      v.literal("attendance_regularization"),
      v.literal("timesheet_approval"),
      v.literal("expense_approval"),
      v.literal("overtime_approval")
    ),
    entityId: v.string(),
    entityType: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("expired")
    ),
    dueDate: v.optional(v.string()),
    metadata: v.object({
      employeeName: v.optional(v.string()),
      amount: v.optional(v.number()),
      days: v.optional(v.number()),
      period: v.optional(v.string()),
    }),
  }).index("by_userId", ["userId"])
    .index("by_type", ["type"])
    .index("by_status", ["status"]),

  // Holidays
  holidays: defineTable({
    date: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    type: v.optional(v.union(
      v.literal("national"),
      v.literal("regional"),
      v.literal("optional"),
      v.literal("floating")
    )),
    locationId: v.optional(v.id("locations")),
    isActive: v.optional(v.boolean()),
  }).index("by_date", ["date"])
    .index("by_locationId", ["locationId"]),

  // Announcements
  announcements: defineTable({
    title: v.string(),
    content: v.string(),
    type: v.optional(v.union(
      v.literal("general"),
      v.literal("policy"),
      v.literal("event"),
      v.literal("urgent")
    )),
    audience: v.optional(v.union(
      v.literal("all"),
      v.literal("department"),
      v.literal("location"),
      v.literal("specific")
    )),
    audienceFilter: v.optional(v.object({
      departments: v.optional(v.array(v.string())),
      locations: v.optional(v.array(v.id("locations"))),
      employees: v.optional(v.array(v.id("employees"))),
    })),
    date: v.optional(v.string()),
    publishDate: v.optional(v.string()),
    expiryDate: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    createdBy: v.optional(v.id("users")),
  }).index("by_publishDate", ["publishDate"])
    .index("by_type", ["type"]),

  // Help Desk
  ticketCategories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    assigneeId: v.optional(v.id("employees")),
    slaHours: v.optional(v.number()),
    isActive: v.boolean(),
  }),

  tickets: defineTable({
    employeeId: v.id("employees"),
    categoryId: v.id("ticketCategories"),
    title: v.string(),
    description: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("resolved"),
      v.literal("closed")
    ),
    assigneeId: v.optional(v.id("employees")),
    attachments: v.optional(v.array(v.string())),
    resolution: v.optional(v.string()),
    resolvedDate: v.optional(v.string()),
  }).index("by_employeeId", ["employeeId"])
    .index("by_status", ["status"])
    .index("by_assigneeId", ["assigneeId"]),

  // Policies
  policies: defineTable({
    title: v.string(),
    category: v.string(),
    content: v.string(),
    version: v.string(),
    effectiveDate: v.string(),
    expiryDate: v.optional(v.string()),
    isActive: v.boolean(),
    createdBy: v.id("users"),
  }).index("by_category", ["category"]),

  // AI Chat History
  aiChatSessions: defineTable({
    userId: v.id("users"),
    sessionId: v.string(),
    messages: v.array(v.object({
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
      timestamp: v.string(),
      functionCalls: v.optional(v.array(v.object({
        name: v.string(),
        arguments: v.string(),
        result: v.optional(v.string()),
      }))),
    })),
    isActive: v.boolean(),
  }).index("by_userId", ["userId"])
    .index("by_sessionId", ["sessionId"]),

  // Audit Log
  auditLogs: defineTable({
    actorId: v.id("users"),
    entity: v.string(),
    entityId: v.string(),
    action: v.string(),
    before: v.optional(v.string()),
    after: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    metadata: v.optional(v.object({
      module: v.optional(v.string()),
      feature: v.optional(v.string()),
      reason: v.optional(v.string()),
    })),
  }).index("by_actorId", ["actorId"])
    .index("by_entity", ["entity"])
    .index("by_action", ["action"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});

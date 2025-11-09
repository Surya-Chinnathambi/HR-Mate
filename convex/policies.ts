import { query } from "./_generated/server";
import { v } from "convex/values";

export const getPolicies = query({
  args: {},
  handler: async (ctx) => {
    return [
      {
        id: "attendance-policy",
        title: "Attendance Policy",
        category: "Attendance",
        content: `
**Working Hours:**
- Standard working hours: 9:00 AM to 6:00 PM (Monday to Friday)
- Lunch break: 1:00 PM to 2:00 PM
- Total working hours per day: 8 hours

**Attendance Requirements:**
- Employees must clock in/out using the HRMS system
- Late arrival (after 9:15 AM) requires manager approval
- Early departure requires prior approval
- Minimum 95% attendance required per month

**Remote Work:**
- Maximum 2 days per week (with manager approval)
- Must maintain same productivity standards
- Regular check-ins required

**Consequences:**
- 3 late arrivals = Written warning
- Attendance below 90% = Performance review
- Unauthorized absence = Salary deduction
        `,
        lastUpdated: "2024-01-15",
        version: "2.1"
      },
      {
        id: "leave-policy",
        title: "Leave Policy",
        category: "Leave Management",
        content: `
**Annual Leave Entitlement:**
- Casual Leave: 12 days per year
- Sick Leave: 10 days per year
- Annual Leave: 21 days per year
- Maternity Leave: 180 days
- Paternity Leave: 15 days

**Leave Application Process:**
1. Submit request through HRMS at least 3 days in advance
2. Manager approval required
3. HR confirmation for leaves > 5 days
4. Medical certificate required for sick leave > 3 days

**Leave Carry Forward:**
- Maximum 5 days can be carried to next year
- Unused leave expires on December 31st
- No cash compensation for unused leave

**Emergency Leave:**
- Can be applied retrospectively with valid reason
- Manager discretion for approval
- Documentation required within 48 hours
        `,
        lastUpdated: "2024-01-10",
        version: "1.8"
      },
      {
        id: "code-of-conduct",
        title: "Code of Conduct",
        category: "Ethics",
        content: `
**Professional Behavior:**
- Maintain respectful communication
- Dress code: Business casual
- No discrimination or harassment
- Confidentiality of company information

**Digital Ethics:**
- Responsible use of company resources
- No personal use of company devices for extended periods
- Social media guidelines apply
- Data protection compliance mandatory

**Workplace Safety:**
- Report safety hazards immediately
- Follow emergency procedures
- Maintain clean workspace
- No alcohol or drugs on premises

**Violations:**
- First offense: Verbal warning
- Second offense: Written warning
- Third offense: Final warning
- Serious violations: Immediate termination
        `,
        lastUpdated: "2024-01-05",
        version: "3.0"
      },
      {
        id: "performance-policy",
        title: "Performance Management",
        category: "Performance",
        content: `
**Performance Review Cycle:**
- Quarterly check-ins with manager
- Annual performance review
- Goal setting and tracking
- 360-degree feedback process

**Performance Ratings:**
- Exceeds Expectations (5)
- Meets Expectations (4)
- Partially Meets Expectations (3)
- Below Expectations (2)
- Unsatisfactory (1)

**Career Development:**
- Individual development plans
- Training budget: $2000 per employee per year
- Mentorship programs available
- Internal promotion priority

**Performance Improvement:**
- Performance Improvement Plan (PIP) for ratings below 3
- 90-day improvement period
- Regular monitoring and support
- Clear success criteria defined
        `,
        lastUpdated: "2024-01-20",
        version: "2.5"
      },
      {
        id: "compensation-policy",
        title: "Compensation & Benefits",
        category: "Compensation",
        content: `
**Salary Structure:**
- Annual salary reviews
- Performance-based increments
- Market benchmarking
- Transparent pay bands

**Benefits Package:**
- Health insurance (100% premium covered)
- Dental and vision coverage
- Life insurance (2x annual salary)
- Retirement savings plan (401k with 6% match)

**Additional Benefits:**
- Flexible spending account
- Employee assistance program
- Gym membership reimbursement
- Professional development budget

**Bonus Structure:**
- Annual performance bonus (0-20% of salary)
- Spot bonuses for exceptional work
- Referral bonuses: $2000 per successful hire
- Long-term incentive plans for senior roles
        `,
        lastUpdated: "2024-01-12",
        version: "1.9"
      }
    ];
  }
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

// Note: In production, use proper password hashing like bcrypt
// For demo purposes, we're using plain text passwords

// Sign up with JWT
export const signUp = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists in auth tables
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingUser) {
      throw new ConvexError("User already exists");
    }

    // Create user in auth table
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      // In production, hash the password properly
      // For demo, we'll store it in a custom field
    });

    // Create employee record
    const employeeId = await ctx.db.insert("employees", {
      userId: userId,
      employeeId: `EMP${Date.now()}`,
      firstName: args.name.split(' ')[0] || args.name,
      lastName: args.name.split(' ').slice(1).join(' ') || '',
      email: args.email,
      designation: "Employee",
      department: "General",
      status: "Active",
      joiningDate: new Date().toISOString().split('T')[0],
    });

    // Generate a simple token (in production, use proper JWT with secret)
    const token = `token_${userId}_${Date.now()}`;

    return { 
      token, 
      user: { 
        _id: userId, 
        email: args.email, 
        name: args.name,
        employeeId: employeeId
      } 
    };
  },
});

// Sign in with JWT
export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Demo credentials
    if (args.email === "demo@company.com" && args.password === "demo123") {
      // Check if demo user exists
      let user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), args.email))
        .first();

      if (!user) {
        // Create demo user
        const userId = await ctx.db.insert("users", {
          email: args.email,
          name: "Demo User",
        });

        // Create demo employee
        const employeeId = await ctx.db.insert("employees", {
          userId: userId,
          employeeId: "EMP001",
          firstName: "Demo",
          lastName: "User",
          email: args.email,
          designation: "Software Engineer",
          department: "Engineering",
          status: "Active",
          joiningDate: "2024-01-01",
          managerId: undefined,
        });

        user = await ctx.db.get(userId);
      }

      const token = `token_${user!._id}_${Date.now()}`;
      return { token, user };
    }

    // For other users, you would implement proper authentication
    throw new ConvexError("Invalid credentials");
  },
});

// Verify JWT token
export const verifyToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    try {
      // Simple token verification (in production, use proper JWT verification)
      const parts = args.token.split('_');
      if (parts.length !== 3 || parts[0] !== 'token') {
        throw new ConvexError("Invalid token format");
      }

      const userId = parts[1];
      const user = await ctx.db.get(userId as any);
      
      if (!user) {
        throw new ConvexError("User not found");
      }

      return user;
    } catch (error) {
      throw new ConvexError("Invalid token");
    }
  },
});

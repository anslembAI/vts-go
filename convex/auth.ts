import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const register = mutation({
    args: { fullName: v.string(), password: v.string() },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_fullName", (q) => q.eq("fullName", args.fullName))
            .first();

        if (existing) {
            throw new Error("User already exists");
        }

        const userId = await ctx.db.insert("users", {
            fullName: args.fullName,
            password: args.password,
        });

        return userId;
    },
});

export const login = mutation({
    args: { fullName: v.string(), password: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_fullName", (q) => q.eq("fullName", args.fullName))
            .first();

        if (!user || user.password !== args.password) {
            throw new Error("Invalid credentials");
        }

        return user._id;
    },
});

export const getUser = query({
    args: { userId: v.optional(v.id("users")) },
    handler: async (ctx, args) => {
        if (!args.userId) return null;
        return await ctx.db.get(args.userId);
    }
});

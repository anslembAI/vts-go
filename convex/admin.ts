import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Key for the standard rate in system_config
const RATE_KEY = "standard_rate";
const DEFAULT_RATE = 8.4;

export const getStandardRate = query({
    args: {},
    handler: async (ctx) => {
        const config = await ctx.db
            .query("system_config")
            .withIndex("by_key", (q) => q.eq("key", RATE_KEY))
            .first();

        return (config?.value as number) ?? DEFAULT_RATE;
    },
});

export const setStandardRate = mutation({
    args: {
        userId: v.id("users"),
        rate: v.number(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user || !user.isAdmin) {
            throw new Error("Unauthorized: Only admins can change the rate.");
        }

        const existing = await ctx.db
            .query("system_config")
            .withIndex("by_key", (q) => q.eq("key", RATE_KEY))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, { value: args.rate });
        } else {
            await ctx.db.insert("system_config", {
                key: RATE_KEY,
                value: args.rate,
            });
        }
    },
});

// Helper to set a user as admin (Security: Open for now to allow initial setup)
export const promoteToAdmin = mutation({
    args: { userId: v.id("users"), secret: v.string() },
    handler: async (ctx, args) => {
        // Simple protection for the example
        if (args.secret !== "admin-secret-123") {
            throw new Error("Invalid secret");
        }
        await ctx.db.patch(args.userId, { isAdmin: true });
    }
});

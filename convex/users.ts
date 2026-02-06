import { query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
    args: { currentUserId: v.id("users") },
    handler: async (ctx, args) => {
        const users = await ctx.db.query("users").collect();
        return users.filter(u => u._id !== args.currentUserId);
    },
});

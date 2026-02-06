import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
    args: { currentUserId: v.id("users") },
    handler: async (ctx, args) => {
        const users = await ctx.db.query("users").collect();
        // Enrich with image URLs
        const enrichedUsers = await Promise.all(users.map(async (u) => {
            let imageUrl = null;
            if (u.imageStorageId) {
                imageUrl = await ctx.storage.getUrl(u.imageStorageId);
            }
            return { ...u, imageUrl };
        }));

        return enrichedUsers.filter(u => u._id !== args.currentUserId);
    },
});

export const updatePhoto = mutation({
    args: { userId: v.id("users"), storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, { imageStorageId: args.storageId });
    },
});

export const getMe = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) return null;
        if (user.imageStorageId) {
            const url = await ctx.storage.getUrl(user.imageStorageId);
            return { ...user, imageUrl: url };
        }
        return user;
    }
});

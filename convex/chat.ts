import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listMessages = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("messages").collect();
    },
});

export const sendMessage = mutation({
    args: { body: v.string(), author: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.insert("messages", {
            body: args.body,
            author: args.author,
            type: "text",
        });
    },
});

export const createRequest = mutation({
    args: {
        usd_amount: v.number(),
        ttd_rate: v.number(),
        author: v.string(),
    },
    handler: async (ctx, args) => {
        const requestId = await ctx.db.insert("requests", {
            usd_amount: args.usd_amount,
            ttd_rate: args.ttd_rate,
            status: "pending",
            timestamp: Date.now(),
            sender: args.author,
        });

        await ctx.db.insert("messages", {
            body: "Money Request",
            author: args.author,
            type: "request",
            requestId: requestId,
        });
        return requestId;
    },
});

export const confirmRequest = mutation({
    args: { requestId: v.id("requests") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.requestId, { status: "received" });
    },
});

export const deleteRequest = mutation({
    args: { requestId: v.id("requests") },
    handler: async (ctx, args) => {
        // Delete the request
        await ctx.db.delete(args.requestId);

        // Find and delete the associated message
        const message = await ctx.db
            .query("messages")
            .filter((q) => q.eq(q.field("requestId"), args.requestId))
            .first();

        if (message) {
            await ctx.db.delete(message._id);
        }
    },
});

export const getRequest = query({
    args: { requestId: v.id("requests") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.requestId);
    },
});

export const getBalance = query({
    args: {},
    handler: async (ctx) => {
        const requests = await ctx.db.query("requests").collect();
        const pending = requests.filter(r => r.status === "pending").reduce((acc, r) => acc + r.usd_amount, 0);

        // Calculate received in TTD
        const received = requests
            .filter(r => r.status === "received")
            .reduce((acc, r) => acc + (r.usd_amount * r.ttd_rate), 0);

        return { pendingUSD: pending, receivedTTD: received };
    }
})

export const saveRate = mutation({
    args: { chatId: v.string(), rate: v.number() },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("preferences")
            .filter(q => q.eq(q.field("chat_id"), args.chatId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, { last_rate: args.rate });
        } else {
            await ctx.db.insert("preferences", {
                chat_id: args.chatId,
                last_rate: args.rate,
            });
        }
    }
});

export const getLastRate = query({
    args: { chatId: v.string() },
    handler: async (ctx, args) => {
        const pref = await ctx.db.query("preferences")
            .filter(q => q.eq(q.field("chat_id"), args.chatId))
            .first();
        return pref?.last_rate ?? 6.80; // Default
    }
})

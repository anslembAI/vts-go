import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listMessages = query({
    args: { conversationId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (!args.conversationId) return [];
        return await ctx.db
            .query("messages")
            .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
            .collect();
    },
});

export const sendMessage = mutation({
    args: { body: v.string(), author: v.string(), conversationId: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.insert("messages", {
            body: args.body,
            author: args.author,
            type: "text",
            conversationId: args.conversationId,
        });
    },
});

export const createRequest = mutation({
    args: {
        usd_amount: v.number(),
        ttd_rate: v.number(),
        author: v.string(),
        conversationId: v.string(),
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
            conversationId: args.conversationId,
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
    args: { conversationId: v.string() },
    handler: async (ctx, args) => {
        // Get all messages in this conversation that are requests
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
            .filter((q) => q.eq(q.field("type"), "request"))
            .collect();

        // Get the request IDs from these messages
        const requestIds = messages
            .map(m => m.requestId)
            .filter((id): id is NonNullable<typeof id> => id !== undefined);

        // Fetch all requests for this conversation
        const requests = await Promise.all(
            requestIds.map(id => ctx.db.get(id))
        );

        // Filter out any null results and calculate balances
        const validRequests = requests.filter((r): r is NonNullable<typeof r> => r !== null);

        const pending = validRequests
            .filter(r => r.status === "pending")
            .reduce((acc, r) => acc + r.usd_amount, 0);

        const received = validRequests
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

        if (pref?.last_rate) {
            return pref.last_rate;
        }

        // Fallback to standard rate
        const config = await ctx.db
            .query("system_config")
            .withIndex("by_key", (q) => q.eq("key", "standard_rate"))
            .first();

        return (config?.value as number) ?? 8.4; // Default if not set in DB
    }
})

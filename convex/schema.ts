import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    body: v.string(),
    author: v.string(),
    type: v.union(v.literal("text"), v.literal("request")),
    requestId: v.optional(v.id("requests")), // Link to a request if it's a request type
    conversationId: v.optional(v.string()), // Optional for backward compatibility, but required for new chats
  }).index("by_conversationId", ["conversationId"]),
  requests: defineTable({
    usd_amount: v.number(),
    ttd_rate: v.number(),
    status: v.union(v.literal("pending"), v.literal("received")),
    timestamp: v.number(),
    sender: v.string(),
    recipient: v.optional(v.string()),
  }),
  preferences: defineTable({
    chat_id: v.string(),
    last_rate: v.number(),
  }),
  users: defineTable(v.any()).index("by_fullName", ["fullName"]),
});

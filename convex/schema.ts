import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    body: v.string(),
    author: v.string(),
    type: v.union(v.literal("text"), v.literal("request")),
    requestId: v.optional(v.id("requests")), // Link to a request if it's a request type
  }),
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
  users: defineTable({
    fullName: v.string(),
    password: v.string(), // Note: In production, hash this!
  }).index("by_fullName", ["fullName"]),
});

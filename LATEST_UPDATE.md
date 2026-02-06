# Latest Update: Real Users & 1-on-1 Chat

I have implemented the "Real Users" functionality (1-on-1 Chat).

## New Features
- **User List**: Once logged in, you will now see a list of other registered users (Contacts).
- **Navigation**: Clicking a contact opens a 1-on-1 chat with them.
- **Chat Isolation**: 
    -   Messages are now private to the conversation (based on the two user IDs).
    -   Requests ("Money Drawer") are also linked to the specific conversation.
- **Schema**: Added `conversationId` to messages and requests filtering.

## Verification
- Reload the app.
- You should see your user list.
- Click a user to start chatting.
- **Note**: Old messages will not appear in the new filtered views.

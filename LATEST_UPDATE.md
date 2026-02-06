# Latest Update: Custom Authentication

I have implemented a custom "No Email" authentication system.

## New Features
- **Auth Modal**: A popup that appears for unauthenticated users.
- **Sign Up / Sign In**: Supports creating accounts and logging in with just "Full Name" and "Password".
- **Persistent Session**: Keeps you logged in using Local Storage.

## Technical Changes
- **Convex Schema**: Added `users` table.
- **Backend**: Added `convex/auth.ts` for handling login/register mutations.
- **Frontend**: Created `src/components/AuthModal.tsx` and updated `App.tsx` and `Chat.tsx` to handle user state.

## Verification
- Reload the app.
- You should be prompted to log in.
- Create an account or sign in.
- Verify that messages you send are now linked to your new user identity.

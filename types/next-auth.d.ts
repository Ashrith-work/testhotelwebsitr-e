import type { DefaultSession } from "next-auth";

// Augment the Session/User types so `session.user.id` and `session.user.phone`
// are available throughout the app (populated by the `session` callback in
// auth.ts).
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      phone?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    phone?: string | null;
  }
}

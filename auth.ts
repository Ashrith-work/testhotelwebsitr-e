import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// NextAuth v5 (Auth.js) configuration.
// - Google is the ONLY sign-in method (no email/password).
// - PrismaAdapter persists users/accounts/sessions to Postgres.
// - Database session strategy (sessions live in the Session table, not a JWT).
//
// NOTE: this module imports Prisma, so it must only run in the Node.js runtime
// (server components, route handlers) — never in Edge middleware. middleware.ts
// deliberately does NOT import this file.
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  // Trust the deployment host header (Vercel sets the URL automatically).
  trustHost: true,
  pages: {
    signIn: "/signin",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // Allow every Google account to sign in. (In Google's "Testing" consent
    // mode only listed test users can reach this; once the consent screen is
    // verified/published, anyone can — we don't gate by an allow-list here.)
    async signIn() {
      return true;
    },
    // With the database strategy, `user` is the persisted User row. The adapter
    // already stores Google's name/email/image on first sign-in; here we just
    // surface the id + phone to the client session.
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.phone = (user as { phone?: string | null }).phone ?? null;
      }
      return session;
    },
  },
});

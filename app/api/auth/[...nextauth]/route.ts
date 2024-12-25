import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { role: true, id: true },
        });

        // Only allow sign in if the user exists and has the ADMIN role
        return dbUser?.role === Role.ADMIN;
      }
      return false; // Deny sign in for any other case
    },
    async jwt({
      token,
      account,
      user,
    }: {
      token: JWT;
      account: {
        access_token?: string;
        [key: string]: any;
      } | null;
      user?: User | AdapterUser;
    }) {
      if (account && account.access_token) {
        token.accessToken = account.access_token;
      }
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { role: true, id: true },
        });
        token.role = dbUser?.role;
        token.userId = dbUser?.id;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT & { accessToken?: string; role?: Role; userId?: string };
    }) {
      return {
        ...session,
        accessToken: token.accessToken,
        role: token.role,
        user: {
          ...session.user,
          id: token.userId,
        },
      } as Session & {
        accessToken?: string;
        role?: Role;
        user: { id?: string };
      };
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/admin",
    error: "/admin/login", // Redirect to login page on error
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

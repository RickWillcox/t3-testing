import NextAuth, {
  type NextAuthOptions,
  User as NextAuthUser,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import GitHubProvider from "next-auth/providers/github";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

interface NextAuthUserWithStringId extends NextAuthUser {
  id: string;
}

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  // adapter: FirestoreAdapter({
  //   apiKey: env.FIREBASE_API_KEY,
  //   appId: env.FIREBASE_APP_ID,
  //   authDomain: env.FIREBASE_AUTH_DOMAIN,
  //   databaseURL: env.FIREBASE_DATABASE_URL,
  //   projectId: env.FIREBASE_PROJECT_ID,
  //   storageBucket: env.FIREBASE_STORAGE_BUCKET,
  //   messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  // }),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        } as NextAuthUserWithStringId;
      },
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

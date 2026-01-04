import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import { getCollection } from "./mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      try {
        const collection = await getCollection("users");
        if (!collection) return true; // Allow sign-in even if DB fails

        // Check if user exists
        const existingUser = await collection.findOne({ email: user.email });

        if (existingUser) {
          // Update existing user with latest info
          await collection.updateOne(
            { email: user.email },
            {
              $set: {
                name: user.name,
                image: user.image,
                provider: account?.provider,
                lastLoginAt: new Date(),
                updatedAt: new Date(),
              },
            }
          );
        } else {
          // Create new user
          await collection.insertOne({
            email: user.email,
            name: user.name,
            image: user.image,
            provider: account?.provider,
            providerId: account?.providerAccountId,
            createdAt: new Date(),
            lastLoginAt: new Date(),
            updatedAt: new Date(),
          });
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return true; // Still allow sign-in
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.provider = account?.provider;
      }

      // Fetch user ID from database if not already set
      if (token.email && !token.dbId) {
        try {
          const collection = await getCollection("users");
          if (collection) {
            const dbUser = await collection.findOne({ email: token.email });
            if (dbUser) {
              token.dbId = dbUser._id.toString();
            }
          }
        } catch {
          // Ignore errors
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.dbId as string) || (token.id as string);
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  trustHost: true,
});

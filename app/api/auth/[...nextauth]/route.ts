import bcrypt from "bcrypt";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import { AuthOptions } from "next-auth";
import connectMongodb from "@/libs/mongoDB";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          // NOTE: here it could also be just another api call to different backend
          await connectMongodb();
          const user = await User.findOne({ email: credentials.email });
          console.log("user in auth", user);
          if (!user) return null;

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) return null;

          return user;
        } catch (error) {
          console.log("error", error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (user) {
        return {
          ...token,
          _id: user._id,
          custom_token: "custom_token_for",
          // photo: user.photo,
          // surname: user.surname,
          // characteristics: user.characteristics,
        };
      }
      return token;
    },
    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          _id: token._id,
          // photo: token.photo,
          // surname: token.surname,
          // characteristics: token?.characteristics,
        },
      };
    },
    async redirect({ url, baseUrl }) {
      // return baseUrl;
      return url.startsWith(baseUrl) ? url : baseUrl + url;
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
  },
  session: {
    strategy: "jwt",
    // maxAge: 10,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

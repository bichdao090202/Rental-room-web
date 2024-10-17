import { NextAuthOptions } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        phone: { label: "phone", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        })

        const user = await res.json();   

        if (!res.ok) throw new Error(user.message);

        if (res.ok && user) {
          return user;
        }

        return null;
      },
    })
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async session({
      session,
      token,
    }: {
      session: any;
      token: JWT;
      user: AdapterUser;
    }) {
      session.accessToken = token.accessToken;
      session.user = token.userInformation;
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {            
        token.accessToken = (user as any).data.access_token;
        token.userInformation = (user as any).data.user_info;
      }
        
      return token;
    },
  }
}

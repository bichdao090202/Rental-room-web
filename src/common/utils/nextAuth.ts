// import { NextAuthOptions } from "next-auth";
// import { AdapterUser } from "next-auth/adapters";
// import { JWT } from "next-auth/jwt";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GitHubProvider from 'next-auth/providers/github';
// import GoogleProvider from 'next-auth/providers/google';

// export const authOptions: NextAuthOptions = {
//   secret: process.env.NEXTAUTH_SECRET,
//   providers: [
//     GitHubProvider({
//       name: "GitHub",
//       clientId: process.env.GITHUB_ID!,
//       clientSecret: process.env.GITHUB_SECRET!
//     }),
//     GoogleProvider({
//       name: "Google",
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         username: { label: "Username", type: "text", placeholder: "jsmith" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials, req) {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/sign-in`, {
//           method: "POST",
//           body: JSON.stringify(credentials),
//           headers: { "Content-Type": "application/json" },
//         })

//         const user = await res.json();

//         if (!res.ok) throw new Error(user.message);

//         if (res.ok && user) {
//           // localStorage.setItem('auth', JSON.stringify(user));
//           return user;
//         }

//         return null;
//       },
//     })
//   ],
//   pages: {
//     signIn: "/login",
//   },
//   callbacks: {
//     // async redirect({ url, baseUrl }) {
//     //   if (url.startsWith(baseUrl)) {
//     //     const urlObj = new URL(url);
//     //     const callbackUrl = urlObj.searchParams.get('callbackUrl');
//     //     if (callbackUrl) {
//     //       return `${callbackUrl}`;
//     //     }
//     //   }
//     //   return url.startsWith(baseUrl) ? url : baseUrl + '/login';
//     // },
//     async session({
//       session,
//       token,
//     }: {
//       session: any;
//       token: JWT;
//       user: AdapterUser;
//     }) {
//       session.accessToken = token.accessToken;
//       session.userInformation = token.userInformation;
//       return session;
//     },
//     // async jwt({ token, user, account, profile }) {
//     //   if (user) {
//     //     token.accessToken = (user as any).data.accessToken;
//     //     token.userInformation = (user as any).data.userInformation
//     //   } 
//     //   return token
//     // }
//     async jwt({ token, user, account, profile }) {
//       // console.log("user: "+ JSON.stringify(user));
//       // console.log("\nAccount: " + JSON.stringify(account));
//       // console.log("token: " + JSON.stringify(token));
//       // console.log("token: " + JSON.stringify(profile));
//       if ((account && account.provider === "github") || (account && account.provider === "google")) {
//         token.accessToken = account.access_token;
//         token.userInformation = {
//           firstName: user?.name, 
//           lastName: "",
//           email: user?.email,
//           avatar: user?.image,
//         };
//       } else if (user) {
//         token.accessToken = (user as any).data.accessToken;
//         token.userInformation = (user as any).data.userInformation;
//       }
//       return token;
//     },
//   }
// }

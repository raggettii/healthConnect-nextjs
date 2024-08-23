import { PrismaClient } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();

let role1: string;
export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        role: {
          label: "Role",
          type: "text",
          placeholder: "user or admin",
        },
        phoneNumber: {
          label: "Phone Number",
          type: "text",
          placeholder: "Your phone number",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your password",
        },
      },
      async authorize(credentials) {
        // after clicking the signin button this function gets in action
        // user return statements here leads to returning actual values
        // means returning null will leads to error throuwn on frontend
        // and returning any data will leads to get it saved int cookies
        // so that we can use it later
        // console.log("HERE 1 ");
        if (
          !credentials?.role ||
          !credentials?.phoneNumber ||
          !credentials?.password
        ) {
          throw new Error("Complete data not provided");
        }

        const { role, phoneNumber, password } = credentials;
        // console.log("HERE 2 ");
        role1 = role.toLowerCase();
        console.log("First role", role);
        const user =
          role === "admin"
            ? await prisma.hospital.findFirst({ where: { phoneNumber } })
            : await prisma.user.findFirst({ where: { phoneNumber } });

        // console.log(user);
        // console.log("HERE 3 ");
        if (!user) {
          console.log("Inside (!user) condition ");
          throw new Error("Error While fetching data from server");
        }
        // console.log(user);
        // let isPasswordValid;
        // console.log(user);
        console.log("second role", role1);
        if (password != user.password) throw new Error("Incorrect Password");
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, credentials }) {
      console.log("user from signIn callback ", user);
      if (credentials.role == "user" || credentials.role == "admin") {
        console.log(credentials.role, "credentials role");
        return true;
      }
      // console.log("credentials  from signIn callback ", credentials.role);
      return false;
    },
    // async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
    //   console.log(role1, "from redirect callback");
    //   if (role1 == "admin") {
    //     return `${baseUrl}/admin-dashboard`; // Redirect to admin dashboard
    //   } else if (role1 == "user") {
    //     return `${baseUrl}/hospitals`; // Redirect to hospitals page
    //   }
    // },
    jwt({ token, user, session }) {
      console.log("jwt callback ", { token, user, session });
      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.fullName,
          address: user.city,
          role: role1,
        };
      }
      return token;
    },
    session({ session, token, user }) {
      console.log("session callback", { session, token, user });
      if (session) {
        return {
          ...session,
          user: {
            ...session.user,
            address: token.address,
            id: token.id,
            role: token.role,
          },
        };
      }
      return session;
    },
  },
};

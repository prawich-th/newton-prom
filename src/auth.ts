import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";
import authConfig from "./auth.config";
import { loginSchema } from "./schema/authSchema";
import { getUserByEmail } from "./data/user";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
  },
  ...authConfig,
  providers: [
    Credentials({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        ticketId: {
          type: "text",
          label: "Ticket ID",
          placeholder: "1234567890",
        },
      },
      authorize: async (credentials, req) => {
        "use server";

        const validated = loginSchema.safeParse(credentials);

        if (!validated.success) {
          return null;
        }

        const user = await getUserByEmail(validated.data.email);

        if (!user) {
          return null;
        }

        if (user.id !== validated.data.ticketId) {
          return null;
        }

        const cookieStore = await cookies();
        cookieStore.set("ticket_type", user.t_type);

        return user;
      },
    }),
  ],
});

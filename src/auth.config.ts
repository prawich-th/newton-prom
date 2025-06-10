import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./schema/authSchema";
import { getUserByEmail } from "./data/user";

export default {
  providers: [],
} satisfies NextAuthConfig;

"use server";

import { signIn } from "@/auth";

export const login = async () => {
  return signIn("credentials", {});
};

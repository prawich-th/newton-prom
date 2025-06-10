"use client";

import { login } from "@/lib/actions/auth";

export default function LoginBtn() {
  return <button onClick={() => login()}>Sign In</button>;
}

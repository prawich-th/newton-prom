"use client";

import { logOut } from "@/actions/authActions";
import React from "react";

export default function LogoutBasic({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={() => {
        logOut();
      }}
    >
      {children}
    </button>
  );
}

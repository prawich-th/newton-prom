"use server";

import { signIn, signOut } from "@/auth";
import { idgen } from "@/lib/idgen";
import prisma from "@/lib/prisma";
import { createSchema, loginSchema } from "@/schema/authSchema";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as z from "zod";

export const createUser = async (values: z.infer<typeof createSchema>) => {
  const data = createSchema.safeParse(values);
  let tid = idgen();

  if (!data.success) {
    return {
      error: data.error.message,
    };
  }
  const { email, name, year, track, room, school, t_dateofpurchase, t_type } =
    data.data;

  console.log(data.data);

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: email }, { id: tid }],
    },
  });

  if (existingUser && existingUser.id !== tid) {
    return {
      error: "User already exists",
    };
  }

  if (existingUser && existingUser.id === tid) {
    console.log(`Duplicate ID Found, generating new id: ${tid}`);
    let eid = true;
    while (eid) {
      tid = idgen();
      const existingUser = await prisma.user.findFirst({ where: { id: tid } });
      if (!existingUser) eid = false;
    }
  }

  const user = await prisma.user.create({
    data: {
      id: tid,
      email,
      name,
      year: parseInt(year),
      track,
      room,
      school,
      t_dateofpurchase: new Date(t_dateofpurchase),
      t_type,
      t_purchasedBy: name,
      t_disabled: false,
      t_checkedIn: false,
      t_checkedInAt: null,
    },
  });

  return {
    user,
    success: `Successfully Created User: ${user.name} Ticket ID: ${user.id}`,
  };
};

export const LoginUser = async (values: z.infer<typeof loginSchema>) => {
  try {
    const data = loginSchema.safeParse(values);

    console.log("on server: ", data.data);

    await signIn("credentials", {
      email: data.data?.email,
      ticketId: data.data?.ticketId,
      redirectTo: "/",
    });

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) {
      console.log("redirect error");
      redirect("/");
    }

    return {
      error: `Invalid Email or Password`,
    };
  } finally {
    console.log("done");
  }
};

export const logOut = async () => {
  const store = await cookies();

  store.delete("ticket_type");

  await signOut();
};

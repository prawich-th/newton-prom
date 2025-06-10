"use server";

import { auth } from "@/auth";
import { getUserByEmail, getUserbyID } from "@/data/user";
import prisma from "@/lib/prisma";

export const checkin = async (ticketId: string) => {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  const admin = await getUserByEmail(session?.user?.email);

  if (admin?.t_type.toUpperCase() !== "STAFF") {
    return { error: "Unauthorised." };
  }

  const user = await getUserbyID(ticketId);

  if (!user) {
    return { error: "User not found" };
  }

  if (user.t_checkedIn) {
    return { error: "User already checked in" };
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      t_checkedIn: true,
      t_checkedInAt: new Date(),
      last_agent: admin.name,
    },
  });

  return { success: "User checked in", user: updatedUser };
};

export const fetchUser = async (ticketId: string) => {
  const user = await getUserbyID(ticketId);

  if (!user) return { error: "User Not Found" };

  return { success: "User Found", user };
};

export const removeCheckin = async (ticketId: string) => {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  const admin = await getUserByEmail(session?.user?.email);

  if (admin?.t_type.toUpperCase() !== "STAFF") {
    return { error: "Unauthorised." };
  }

  console.log("removing checkin for", ticketId);

  const user = await getUserbyID(ticketId);

  if (!user) {
    return { error: "User not found" };
  }

  if (!user.t_checkedIn) {
    return { error: "User not checked in" };
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { t_checkedIn: false, t_checkedInAt: null, last_agent: admin.name },
  });

  return { success: "Removed Checkin Status", user: updatedUser };
};

export const disableUser = async (ticketId: string) => {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  const admin = await getUserByEmail(session?.user?.email);

  if (admin?.t_type.toUpperCase() !== "STAFF") {
    return { error: "Unauthorised." };
  }

  console.log("disabling user for", ticketId);

  const user = await getUserbyID(ticketId);

  if (!user) {
    return { error: "User not found" };
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { t_disabled: true },
  });

  return { success: "Disabled User's Royalty Eligibility", user: updatedUser };
};

export const enableUser = async (ticketId: string) => {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  const admin = await getUserByEmail(session?.user?.email);

  if (admin?.t_type.toUpperCase() !== "STAFF") {
    return { error: "Unauthorised." };
  }

  console.log("enabling user for", ticketId);

  const user = await getUserbyID(ticketId);

  if (!user) {
    return { error: "User not found" };
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { t_disabled: false, last_agent: admin.name },
  });

  return { success: "Enabled User's Royalty Eligibility", user: updatedUser };
};

export const getAllAttendees = async () => {
  const attendees = await prisma.user.findMany();

  // await new Promise((resolve) => setTimeout(resolve, 10000));

  return { success: "All attendees fetched", attendees };
};

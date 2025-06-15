"use server";

import { getUserbyID } from "@/data/user";
import { AuthAdmin } from "@/lib/permission";
import prisma from "@/lib/prisma";
import { transferSchema } from "@/schema/authSchema";
import { z } from "zod";
import { idgen } from "@/lib/idgen";

export const checkin = async (ticketId: string) => {
  try {
    const admin = await AuthAdmin();

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
  } catch (error) {
    return { error: "Something went wrong: " + error };
  }
};

export const fetchUser = async (ticketId: string) => {
  const user = await getUserbyID(ticketId);

  if (!user) return { error: "User Not Found" };

  return { success: "User Found", user };
};

export const removeCheckin = async (ticketId: string) => {
  try {
    const admin = await AuthAdmin();

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
  } catch (error) {
    return { error: "Something went wrong: " + error };
  }
};

export const disableUser = async (ticketId: string) => {
  try {
    const admin = await AuthAdmin();

    const user = await getUserbyID(ticketId);

    if (!user) {
      return { error: "User not found" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { t_disabled: true },
    });

    return {
      success: "Disabled User's Royalty Eligibility",
      user: updatedUser,
    };
  } catch (error) {
    return { error: "Something went wrong: " + error };
  }
};

export const enableUser = async (ticketId: string) => {
  try {
    const admin = await AuthAdmin();

    // console.log("FETCHING USER: ", ticketId);
    const user = await getUserbyID(ticketId);

    if (!user) {
      return { error: "User not found" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { t_disabled: false, last_agent: admin.name },
    });

    return { success: "Enabled User's Royalty Eligibility", user: updatedUser };
  } catch (error) {
    return { error: "Something went wrong: " + error };
  }
};

export const getAllAttendees = async () => {
  const attendees = await prisma.user.findMany();

  // await new Promise((resolve) => setTimeout(resolve, 10000));

  return { success: "All attendees fetched", attendees };
};

export const edit = async (
  data: z.infer<typeof transferSchema>,
  mode: "edit" | "transfer" = "edit"
) => {
  try {
    const admin = await AuthAdmin();
    const transferTo = transferSchema.safeParse(data);
    let msg = "Ticket Edited Successfully";

    if (!transferTo.success) {
      return { error: "Invalid Data" };
    }

    const ticket = await getUserbyID(data.id);

    if (!ticket) {
      return { error: "Ticket not found" };
    }

    let newTicketId = ticket.id;

    if (mode === "transfer") {
      newTicketId = await idgen();

      if (!newTicketId) {
        return { error: "Failed to generate new ticket ID" };
      }

      if (transferTo.data.email === ticket.email) {
        return {
          error: "Cannot transfer to same email, use edit mode instead.",
        };
      }

      msg = "Ticket transferred";
    }

    const updatedUser = await prisma.user.update({
      where: { id: ticket.id },
      data: {
        id: newTicketId,
        name: transferTo.data.name,
        email: transferTo.data.email,
        year: parseInt(transferTo.data.year),
        track: transferTo.data.track,
        room: transferTo.data.room,
        last_agent: admin.name,
      },
    });

    return { success: msg, user: updatedUser };
  } catch (error) {
    return { error: "Internal Server Error: " + error };
  }
};

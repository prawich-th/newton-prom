"use server";

import { auth } from "@/auth";
import { getUserByEmail } from "@/data/user";
import prisma from "@/lib/prisma";

export const vote = async (votedForId: string, type: "king" | "queen") => {
  try {
    console.log("voting");
    const session = await auth();

    if (!session?.user?.email) {
      return { error: "Unauthorized" };
    }
    const user = await getUserByEmail(session?.user?.email);

    if (!user) {
      return { error: "User not found" };
    }

    if (user.id === votedForId) {
      return { error: "You cannot vote for yourself" };
    }

    const votedFor = await prisma.user.findUnique({
      where: { id: votedForId },
    });
    if (!votedFor) {
      return { error: "User not found" };
    }

    if (type === "king") {
      await prisma.user.update({
        where: { id: user.id },
        data: { votedKingFor: { connect: { id: votedForId } } },
      });

      return {
        success: "Successfully voted for " + votedFor.name + " as King",
      };
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { votedQueenFor: { connect: { id: votedForId } } },
      });

      return {
        success: "Successfully voted for " + votedFor.name + " as Queen",
      };
    }
  } catch (error) {
    return { error: "Failed to vote" };
  }
};

export const getUserForVote = async () => {
  const users = await prisma.user.findMany({
    where: {
      t_type: {
        not: "supervisor",
      },
      t_checkedIn: true,
      year: 13,
      school: "Newton",
    },
  });

  return users;
};

export const disconnectVote = async (userId: string) => {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  const admin = await getUserByEmail(session?.user?.email);

  if (admin?.t_type.toUpperCase() !== "STAFF") {
    return { error: "Unauthorised." };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    return { error: "User not found" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      votedKingFor: { disconnect: true },
      votedQueenFor: { disconnect: true },
    },
  });

  return { success: "Vote disconnected" };
};

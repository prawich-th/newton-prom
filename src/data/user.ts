"use server";

import prisma from "@/lib/prisma";

export const getUserByEmail = async (email: string) => {
  "use server";

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
};

export const getUserbyID = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return user;
};

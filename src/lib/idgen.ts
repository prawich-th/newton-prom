"use server";

import prisma from "./prisma";

const CHAR_IN_ID = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];

export const idgen = async (length: number = 6, check: boolean = false) => {
  let id = "";

  for (let i = 0; i < length; i++) {
    id += CHAR_IN_ID[Math.floor(Math.random() * 36)];
  }

  if (check) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (user) {
      console.log(`Duplicate ID Found, generating new id: ${id}`);
      let eid = true;
      while (eid) {
        id = await idgen();
        const existingUser = await prisma.user.findUnique({
          where: { id: id },
        });
        if (!existingUser) eid = false;
      }
    }
  }

  return id;
};

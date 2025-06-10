import { User } from "@/generated/prisma";

export const isEligibleForRoyalty = (user: User) => {
  return user.year === 13 && user.school === "Newton";
};

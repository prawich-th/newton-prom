import { auth } from "@/auth";
import { getUserByEmail } from "@/data/user";

export const AuthAdmin = async () => {
  const session = await auth();
  if (!session?.user?.email) throw new Error("No Session");

  const admin = await getUserByEmail(session?.user?.email);
  if (!admin) throw new Error("Forbidden");
  if (admin.t_type !== "Staff") throw new Error("Unauthorised");

  return admin;
};

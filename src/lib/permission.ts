import { auth } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { redirect } from "next/navigation";

const ADMIN_ROLES = ["Admin", "Super Admin", "Registration"];

export const AuthAdmin = async (direct: boolean = false) => {
  const session = await auth();
  if (!session?.user?.email) throw new Error("No Session");

  const admin = await getUserByEmail(session?.user?.email);
  if (!admin) throw new Error("Forbidden");
  if (!ADMIN_ROLES.includes(admin.t_type)) {
    if (direct) {
      redirect("/");
    }
    throw new Error("Unauthorised");
  }

  return admin;
};

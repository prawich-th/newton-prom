import { auth } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  console.log("issess");
  const user = await getUserByEmail(session?.user?.email);
  console.log(user);
  if (user && user.t_type !== "Staff") redirect("/");
  return <>{children}</>;
}

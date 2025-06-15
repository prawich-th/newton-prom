import { AuthAdmin } from "@/lib/permission";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await AuthAdmin(true);
  return <>{children}</>;
}

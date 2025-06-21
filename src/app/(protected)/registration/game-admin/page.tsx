import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GameAdminPanel } from "./GameAdminPanel";

export default async function GameAdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Mayor's Gambit - Admin Panel
            </h1>
            <p className="text-gray-300 text-lg">
              Manage the global game and monitor player activity
            </p>
          </div>

          <GameAdminPanel />
        </div>
      </div>
    </div>
  );
}

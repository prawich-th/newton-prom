import { auth } from "@/auth";
import { redirect } from "next/navigation";
import styles from "./page.module.scss";
import { GameLobby } from "./GameLobby";

export default async function GamePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className={styles.gamePage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Mayor's Gambit</h1>
          <p className={styles.subtitle}>
            A global game of deception, strategy, and survival
          </p>
        </div>

        <GameLobby />
      </div>
    </div>
  );
}

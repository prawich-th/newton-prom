import { cookies } from "next/headers";
import styles from "./page.module.scss";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const store = await cookies();

  const type = store.get("ticket_type")?.value || null;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {session?.user ? (
          <div className={styles.hero}>
            <h3>Welcome Back!</h3>
            <h2>{session.user.name}</h2>
            <p>Celebrating Newton Sixth Class of 2025's Success</p>
          </div>
        ) : (
          <div className={styles.hero}>
            <h2>Hi!</h2>
            <p>Welcome to the Prom 2025 System. Please login to continue.</p>
          </div>
        )}

        <div className={styles.ctas}>
          {session ? (
            <>
              <a className={styles.primary} href="/ticket">
                My Ticket
              </a>{" "}
              <a className={styles.primary} href="/vote">
                Vote
              </a>
            </>
          ) : (
            <a className={styles.primary} href="/auth/login">
              Login
            </a>
          )}
          {type && (type === "Admin" || type === "Super Admin") && (
            <a className={styles.secondary} href="/registration">
              Staff
            </a>
          )}
        </div>
      </main>
    </div>
  );
}

import styles from "./page.module.scss";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  console.log(session);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Hi! {session?.user?.name}</h1>
        <p>Welcome to Registration Console</p>

        <div className={styles.ctas}>
          <a className={styles.primary} href="/registration/checkin">
            Check In Attendees
          </a>
          <a className={styles.secondary} href="/registration/directory">
            All
          </a>
          <a href="/registration/new-user">New User</a>
        </div>
      </main>
    </div>
  );
}

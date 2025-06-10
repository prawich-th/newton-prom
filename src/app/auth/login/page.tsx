import { auth } from "@/auth";
import styles from "./login.module.scss";
import LoginForm from "./loginForm";

export default async function Ticket() {
  const session = await auth();
  console.log("session", session);

  return (
    <div className={styles.container}>
      <h2>Login</h2>

      <LoginForm />
    </div>
  );
}

import { auth } from "@/auth";
import styles from "./login.module.scss";
import LoginForm from "./loginForm";
import { redirect } from "next/navigation";

export default async function Ticket() {
  const session = await auth();
  if (session) return redirect("/");

  return (
    <div className={styles.container}>
      <h2>Login</h2>

      <LoginForm />
    </div>
  );
}

import { signIn } from "../../auth";
import styles from "./board.module.scss";
import LoginBtn from "./loginbtn";

export default function Ticket() {
  return (
    <div className={styles.container}>
      <h2>Login</h2>

      <form
        action={async (formData) => {
          "use server";
          await signIn("credentials", formData);
        }}
      >
        <label>
          Email
          <input name="email" type="email" />
        </label>
        <label>
          Password
          <input name="password" type="password" />
        </label>
        <button>Sign In</button>
      </form>

      <LoginBtn />
    </div>
  );
}

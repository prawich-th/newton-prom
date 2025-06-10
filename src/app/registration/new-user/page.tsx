import styles from "./board.module.scss";
import CreateUserForm from "./createUserForm";

export default function Ticket() {
  return (
    <div className={styles.container}>
      <h2>Create New User</h2>

      <CreateUserForm />
    </div>
  );
}

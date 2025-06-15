import { FetchUser } from "./fetchuser";
import styles from "./checkin.module.scss";

export default function Checkin() {
  return (
    <div className={styles.container}>
      <h2>Checkin</h2>
      <FetchUser />
    </div>
  );
}

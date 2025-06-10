import { FetchUser } from "./fetchuser";
import styles from "./checkin.module.scss";
import { idgen } from "@/lib/idgen";

// WFqeUgO2MA8Dp1syS5i-8

export default function Checkin() {
  return (
    <div className={styles.container}>
      <p>WFqeUgO2MA8Dp1syS5i-8</p>
      <h2>Checkin</h2>
      <FetchUser />
    </div>
  );
}

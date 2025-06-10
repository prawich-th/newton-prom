import { Suspense } from "react";
import { AllUsers } from "./allattendees";
import styles from "./checkin.module.scss";
import Loading from "@/app/loading";

// WFqeUgO2MA8Dp1syS5i-8

export default function Checkin() {
  return (
    <div className={styles.container}>
      <h2>Prom Directory</h2>

      <Suspense fallback={<Loading />}>
        <AllUsers />
      </Suspense>
    </div>
  );
}

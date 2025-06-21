"use client";

import styles from "../vote/candidate.module.scss";

export default function PlayerActionCard({
  name,
  id,
  year,
  track,
  hidden,
}: {
  name: string;
  id: string;
  year: number;
  track: string;
  actionType: "kill" | "arrest" | "vote";
  disabled: boolean;
  onAction: (id: string) => void;
  hidden: boolean;
  actionLabel: string;
}) {
  return (
    <div
      className={`${styles.candidate} ${hidden ? styles.hidden : styles.show}`}
    >
      <div className={styles.candidateInfo}>
        <h3>{name}</h3>
        <p>
          Year {year} {track}
        </p>
      </div>
    </div>
  );
}

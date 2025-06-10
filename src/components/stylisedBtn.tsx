import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import styles from "./stylisedBtn.module.scss";

export default function StylisedBtn(
  props: {
    children: React.ReactNode;
  } & DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  return (
    <div className={styles.container}>
      <button className={styles.button} {...props}>
        <span>{props.children}</span>
      </button>
    </div>
  );
}

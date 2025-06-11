import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import styles from "./stylisedBtn.module.scss";

export default function StylisedBtn(
  props: {
    children: React.ReactNode;
    spanstyle?: React.CSSProperties;
  } & DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  return (
    <div className={styles.container}>
      <button className={styles.button} {...props}>
        <span style={props.spanstyle}>{props.children}</span>
      </button>
    </div>
  );
}

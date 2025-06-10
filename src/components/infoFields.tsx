export default function InfoField(props: {
  value: string;
  type?: "normal" | "error" | "success";
  fullWidth?: boolean;
}) {
  const { value, type = "normal", fullWidth = true } = props;
  const color =
    type === "error" ? "white" : type === "success" ? "white" : "white";
  const backgroundColor =
    type === "error"
      ? "red"
      : type === "success"
      ? "rgb(0, 138, 28)"
      : "rgb(10, 15, 31)";
  return (
    <p
      style={{
        marginBottom: "0.5rem",
        width: fullWidth ? "100%" : "80%",
        borderBottom: "1px solid #2b2b2b",
        borderTop: "1px solid #5c5c5c",
        paddingBottom: "0.5rem",
        color,
        backgroundColor,
        padding: "0.5rem",
        borderRadius: "0.5rem",
        boxShadow: "0 0 0.5rem 0 rgba(88, 88, 88, 0.1)",
      }}
    >
      {value}
    </p>
  );
}

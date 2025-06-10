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
      ? "rgb(174, 0, 0)"
      : type === "success"
      ? "rgb(0, 138, 28)"
      : "rgb(10, 15, 31)";
  const borderColor =
    type === "error"
      ? "rgb(204, 78, 78)"
      : type === "success"
      ? "rgb(0, 159, 32)"
      : "#5c5c5c";
  const flareColor =
    type === "error"
      ? "rgb(223, 33, 33)"
      : type === "success"
      ? "rgb(0, 174, 35)"
      : "rgb(33, 37, 52)";
  const insideColor =
    type === "error"
      ? "rgb(117, 0, 0)"
      : type === "success"
      ? "rgb(0, 97, 19)"
      : "rgb(13, 21, 44)";
  return (
    <p
      style={{
        marginBottom: "0.5rem",
        width: fullWidth ? "100%" : "80%",
        borderBottom: "1px solid #2b2b2b",
        borderTop: `1px solid ${borderColor}`,
        paddingBottom: "0.5rem",
        color,
        backgroundColor,
        padding: "0.5rem",
        borderRadius: "0.5rem",
        boxShadow: "0 0 0.5rem 0 rgba(88, 88, 88, 0.1)",
        backgroundImage: `radial-gradient(
          at 95% 89%,
            ${insideColor} 0px,
            transparent 50%
          ),
          radial-gradient(at 0% 100%, rgba(105, 105, 105, 0.23) 6px, transparent 20%),
            radial-gradient(at 0% 0%, ${flareColor} 0px, transparent 50%)`,
      }}
    >
      {value}
    </p>
  );
}

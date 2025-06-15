import { Scanner } from "@yudiel/react-qr-scanner";

export default function QrScan({
  setCode,
}: {
  setCode: (code: string) => void;
}) {
  return (
    <div>
      <Scanner
        onScan={(result) => {
          setCode(result[0].rawValue);
        }}
      />
    </div>
  );
}

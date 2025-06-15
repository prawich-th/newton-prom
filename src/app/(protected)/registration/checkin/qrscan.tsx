import { Scanner } from "@yudiel/react-qr-scanner";

export default function QrScan({
  setCode,
}: {
  setCode: (code: string) => void;
}) {
  return (
    <div>
      <Scanner
        allowMultiple={false}
        formats={["qr_code"]}
        onScan={(result) => {
          setCode(result[0].rawValue);
          console.log(result);
        }}
      />
    </div>
  );
}

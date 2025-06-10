"use client";

import { useQRCode } from "next-qrcode";
import { useEffect, useState, useRef } from "react";

export default function QRCode({ text }: { text: string }) {
  const { SVG } = useQRCode();
  const [conceal, setConceal] = useState<boolean>(true);
  const [time, setTime] = useState<number>(60);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      <SVG text={text} options={{ width: 250, margin: 1 }} />
      <span
        onClick={() => {
          if (!conceal) {
            console.log("clearing interval");
            setConceal(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
            setTime(60);
            return;
          }

          intervalRef.current = setInterval(() => {
            setTime((time) => {
              console.log(time);
              return time - 1;
            });
          }, 1000);

          timeoutRef.current = setTimeout(() => {
            setConceal(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
            setTime(60);
          }, 60000);

          setConceal(false);
        }}
      >
        {conceal ? (
          <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
            ...Tap to reveal Ticket ID...
          </p>
        ) : (
          <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
            {text} ({time}s)
          </p>
        )}
      </span>
    </>
  );
}

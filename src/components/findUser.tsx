"use client";

import { User } from "@/generated/prisma";
import { fetchUser } from "@/actions/registrationActions";
import { toast } from "react-hot-toast";
import { useEffect, useState, useTransition } from "react";
import StylisedBtn from "./stylisedBtn";
import styles from "./findUser.module.scss";

export default function FindUser({
  liftUser,
  providedId,
}: {
  liftUser: (user: User) => void;
  providedId?: string | null;
}) {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const [ticketId, setTicketId] = useState<string>(providedId || "");

  useEffect(() => {
    if (providedId) {
      setSuccess("Redirected Successfully");
    }
  }, [providedId]);

  const finduser = async (data: string) => {
    const lToast = toast.loading("Fetching user...");

    setError("");
    setSuccess("");

    console.log(data);
    startTransition(async () => {
      const result = await fetchUser(data);
      console.log(result);
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        setSuccess(result.success || "User checked in");
        liftUser(result.user as User);
        toast.success(result.success || "User checked in");
      }
      toast.dismiss(lToast);
    });
  };
  return (
    <div>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();

          finduser(ticketId);
        }}
      >
        <div className={styles.info}>
          <div>
            <input
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              disabled={isPending}
            />
          </div>
          <StylisedBtn type="submit" disabled={isPending}>
            {isPending ? "Loading..." : "Find User"}
          </StylisedBtn>
        </div>
        <div className={styles.notification}>
          {error && <p style={{ color: "pink" }}>{error}</p>}
          {success && <p style={{ color: "lime" }}>{success}</p>}
        </div>
      </form>
    </div>
  );
}

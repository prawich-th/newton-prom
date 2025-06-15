"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { User } from "@/generated/prisma";
import FindUser from "@/components/findUser";
import { useSearchParams } from "next/navigation";
import { getUserbyID } from "@/data/user";
import { toast } from "react-hot-toast";
import EditTicketForm from "./ticketEditor";
import UserTile from "@/components/userTile/userTile";

export default function TransferTicketPage() {
  const [ticket, setTicket] = useState<User | null>(null);

  const ticketId = useSearchParams().get("ticketid");

  const ticketLift = (user: User) => {
    console.log("Lifted", user);
    setTicket(user);
  };

  useEffect(() => {
    if (ticketId) {
      getUserbyID(ticketId)
        .then((user) => {
          setTicket(user);
        })
        .catch((err) => {
          toast.error("Failed to get user");
          console.log(err);
        });
    }
  }, []);

  return (
    <div className={styles.container}>
      <h2>Edit Ticket</h2>

      <p>{ticket?.name}</p>
      <FindUser liftUser={ticketLift} providedId={ticketId} />
      {ticket && (
        <div className={styles.allforms}>
          <div className={styles.info}>
            <UserTile user={ticket} actions={false} />
          </div>
          <EditTicketForm ticket={ticket} liftUser={ticketLift} />
        </div>
      )}
    </div>
  );
}

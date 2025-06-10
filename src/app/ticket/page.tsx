import { redirect } from "next/navigation";
import { auth } from "../../auth";
import styles from "./ticket.module.scss";
import { getUserByEmail } from "@/data/user";
import QRCode from "./qrcode";
import { interpretTrack } from "@/lib/interpretTrack";
import { isEligibleForRoyalty } from "@/lib/royaltyhelper";
import InfoField from "@/components/infoFields";
import { Suspense } from "react";

export default async function Ticket() {
  const session = await auth();
  console.log(session);

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  const user = await getUserByEmail(session?.user?.email);

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className={styles.container}>
      <div className={styles.name}>
        <h2>Welcome,</h2>
        <h2 id="usersname">{user.name}</h2>
        <p>
          Year {user.year} {interpretTrack(user.track)}
        </p>
      </div>

      <div className={styles.main}>
        <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Please show this QR code to the Registration Team
        </p>
        <div className={styles.qrcode}>
          {/* <Suspense fallback={<div>Loading...</div>}> */}
          <QRCode text={user.id} />
        </div>
        <h3 style={{ textTransform: "uppercase" }}>{user.t_type}</h3>
      </div>
      <div className={styles.ticketInfo}>
        <h4>Ticket Information</h4>
        <InfoField
          value={
            user.t_checkedIn
              ? `Checked in at ${user.t_checkedInAt?.toLocaleTimeString(
                  "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }
                )}`
              : "Not checked in"
          }
          type="normal"
          fullWidth
        />
        <InfoField
          value={`Purchased On: ${user.t_dateofpurchase.toLocaleDateString()}`}
          type="normal"
          fullWidth
        />

        <InfoField
          value={`Purchased By: ${user.t_purchasedBy}`}
          type="normal"
          fullWidth
        />
        {isEligibleForRoyalty(user) ? (
          <InfoField
            value={`You are eligible to be voted for as prom royalty. To withdraw your
          name from consideration, please contact the Registration Team.`}
            type="normal"
            fullWidth
          />
        ) : (
          <InfoField
            value={`You are not eligible to be voted for as prom royalty.`}
            type="normal"
            fullWidth
          />
        )}

        <p>DO NOT GIVE YOUR TICKET ID TO ANYONE</p>
      </div>
    </div>
  );
}

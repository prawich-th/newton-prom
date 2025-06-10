import { User } from "@/generated/prisma";
import styles from "./userTile.module.scss";
import InfoField from "@/components/infoFields";
import { interpretTrack } from "@/lib/interpretTrack";

export default function UserTile({ user }: { user: User }) {
  return (
    <div className={styles.container}>
      <h3>{user.name}</h3>
      <InfoField value={`Year: ${user.year}`} fullWidth />
      <InfoField value={`Track: ${interpretTrack(user.track)}`} fullWidth />
      <InfoField value={user.t_type} fullWidth />
      <InfoField
        fullWidth
        value={
          user.t_checkedIn
            ? `Checked In at ${user.t_checkedInAt?.toLocaleString("en-GB")}`
            : "Not Checked In"
        }
        type={user.t_checkedIn ? "success" : "error"}
      />
      <InfoField value={user.t_disabled ? "Disabled" : "Enabled"} fullWidth />
      <InfoField value={user.id} fullWidth />
      <InfoField value={user.email} fullWidth />
      {/* <p>{user.t_disabledAt?.toLocaleString()}</p>
      <p>{user.t_disabledBy?.name}</p>
      <p>{user.t_disabledBy?.email}</p> */}
    </div>
  );
}

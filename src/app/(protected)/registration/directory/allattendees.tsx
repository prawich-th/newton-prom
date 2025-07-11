import { getAllAttendees } from "@/actions/registrationActions";
import UserTile from "@/components/userTile/userTile";
import styles from "./allitems.module.scss";

export const AllUsers = async () => {
  const all = await getAllAttendees();
  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {all.attendees.map((user: any) => (
          <UserTile user={user} key={user.id} />
        ))}
      </div>
    </div>
  );
};

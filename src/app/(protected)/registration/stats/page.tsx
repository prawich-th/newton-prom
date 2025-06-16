import { getStats } from "@/actions/registrationActions";
import InfoField from "@/components/infoFields";
import Tile from "@/components/tile/tile";

export default async function Stats() {
  const { users } = await getStats();

  if (!users) {
    return <div>No users found</div>;
  }

  const totalUsers = users.length;

  const checkedIn = users.filter((user) => user.t_checkedIn === true).length;
  const notCheckedIn = users.filter((user) => !user.t_checkedIn).length;

  // Group users by year and room, with check-in status
  const statsByYearAndRoom = users.reduce(
    (acc, user) => {
      const year = user.year.toString();
      if (!acc[year]) {
        acc[year] = {
          total: 0,
          checkedIn: 0,
          notCheckedIn: 0,
          rooms: {},
        };
      }
      if (!acc[year].rooms[user.room]) {
        acc[year].rooms[user.room] = {
          total: 0,
          checkedIn: 0,
          notCheckedIn: 0,
        };
      }
      acc[year].total++;
      acc[year].rooms[user.room].total++;
      if (user.t_checkedIn) {
        acc[year].checkedIn++;
        acc[year].rooms[user.room].checkedIn++;
      } else {
        acc[year].notCheckedIn++;
        acc[year].rooms[user.room].notCheckedIn++;
      }
      return acc;
    },
    {} as Record<
      string,
      {
        total: number;
        checkedIn: number;
        notCheckedIn: number;
        rooms: Record<
          string,
          { total: number; checkedIn: number; notCheckedIn: number }
        >;
      }
    >
  );

  return (
    <div>
      <h1>Stats</h1>
      <Tile>
        <InfoField value={`Total Users: ${totalUsers}`} type="normal" />
        <InfoField value={`Checked In: ${checkedIn}`} type="success" />
        <InfoField value={`Not Checked In: ${notCheckedIn}`} type="error" />
      </Tile>
      {Object.entries(statsByYearAndRoom).map(([year, yearStats]) => (
        <Tile key={year}>
          <h2>Year {year}</h2>
          <div style={{ marginBottom: "1rem" }}>
            <h3>Year Total</h3>
            <InfoField value={`Total: ${yearStats.total}`} type="normal" />
            <InfoField
              value={`Checked In: ${yearStats.checkedIn}`}
              type="success"
            />
            <InfoField
              value={`Not Checked In: ${yearStats.notCheckedIn}`}
              type="error"
            />
          </div>
          {Object.entries(yearStats.rooms).map(([room, stats]) => (
            <div key={room} style={{ marginBottom: "1rem" }}>
              <h3>Room {room}</h3>
              <InfoField value={`Total: ${stats.total}`} type="normal" />
              <InfoField
                value={`Checked In: ${stats.checkedIn}`}
                type="success"
              />
              <InfoField
                value={`Not Checked In: ${stats.notCheckedIn}`}
                type="error"
              />
            </div>
          ))}
        </Tile>
      ))}
    </div>
  );
}

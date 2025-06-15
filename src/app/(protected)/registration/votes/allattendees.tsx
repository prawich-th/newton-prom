import { getVotes } from "@/actions/voteActions";
import styles from "./allitems.module.scss";
import Tile from "@/components/tile/tile";
import InfoField from "@/components/infoFields";
import { cookies } from "next/headers";

export const AllUsers = async () => {
  const all = await getVotes();
  const store = await cookies();
  const voteFor = store.get("ticket_type")?.value === "Super Admin";

  const mostVoteKing = all.reduce((max: any, user: any) => {
    return user._count.votedKingBy > max._count.votedKingBy ? user : max;
  }, all[0]);
  const mostVoteQueen = all.reduce((max: any, user: any) => {
    return user._count.votedQueenBy > max._count.votedQueenBy ? user : max;
  }, all[0]);

  // sort all by kings and queens vote count combined
  const sorted = all.sort((a: any, b: any) => {
    return (
      b._count.votedKingBy +
      b._count.votedQueenBy -
      (a._count.votedKingBy + a._count.votedQueenBy)
    );
  });

  return (
    <div className={styles.container}>
      <h2>Most Voted</h2>
      <div className={styles.list}>
        <Tile>
          <h3>{mostVoteKing.name}</h3>
          <InfoField
            value={`King Votes: ${mostVoteKing._count.votedKingBy}`}
            fullWidth
            type="success"
          />
          <InfoField
            value={`Queen Votes: ${mostVoteKing._count.votedQueenBy}`}
            fullWidth
          />
        </Tile>
        <Tile>
          <h3>{mostVoteQueen.name}</h3>
          <InfoField
            value={`King Votes: ${mostVoteQueen._count.votedKingBy}`}
            fullWidth
          />
          <InfoField
            value={`Queen Votes: ${mostVoteQueen._count.votedQueenBy}`}
            fullWidth
            type="success"
          />
        </Tile>
      </div>
      <h2>All Users</h2>
      <div className={styles.list}>
        {sorted.map((user: any) => (
          <Tile key={user.id}>
            <h3>{user.name}</h3>
            <InfoField
              value={`King Votes: ${user._count.votedKingBy}`}
              type={user.id === mostVoteKing.id ? "success" : "normal"}
              fullWidth
            />
            <InfoField
              value={`Queen Votes: ${user._count.votedQueenBy}`}
              type={user.id === mostVoteQueen.id ? "success" : "normal"}
              fullWidth
            />
            {voteFor && (
              <>
                <InfoField
                  value={`King For: ${user.votedKingFor?.name || "None"}`}
                  fullWidth
                  type={user.votedKingFor ? "success" : "error"}
                />
                <InfoField
                  value={`Queen For: ${user.votedQueenFor?.name || "None"}`}
                  fullWidth
                  type={user.votedQueenFor ? "success" : "error"}
                />
              </>
            )}
          </Tile>
        ))}
      </div>
    </div>
  );
};

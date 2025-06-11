import styles from "./page.module.scss";
import CandidateList from "./candidatelist";
import { disconnectVote, getUserForVote } from "@/actions/voteActions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/data/user";
import StylisedBtn from "@/components/stylisedBtn";
import UnlinkButton from "./unlink";

export default async function Vote() {
  const allTickets = await getUserForVote();
  const session = await auth();

  if (!session?.user?.email) {
    return redirect("/");
  }

  const user = await getUserByEmail(session?.user?.email);

  const votedKing = user?.votedKingForId;
  const votedQueen = user?.votedQueenForId;

  return (
    <div className={styles.container}>
      <h2>Vote</h2>
      <p>Using {user?.name}'s ticket</p>
      <UnlinkButton userId={user?.id || ""} />
      <CandidateList
        allTickets={allTickets}
        votedKing={votedKing || null}
        votedQueen={votedQueen || null}
      />
    </div>
  );
}

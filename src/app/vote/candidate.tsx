"use client";

import StylisedBtn from "@/components/stylisedBtn";
import styles from "./candidate.module.scss";
import { interpretTrack } from "@/lib/interpretTrack";
import { vote } from "@/actions/voteActions";
import { useTransition } from "react";
import { toast } from "react-hot-toast";

export default function Candidate({
  name,
  id,
  year,
  track,
  votedKing,
  votedQueen,
  setVotedKing,
  setVotedQueen,
  hidden,
}: {
  name: string;
  id: string;
  year: number;
  track: string;
  votedKing: string | null;
  votedQueen: string | null;
  setVotedKing: (id: string) => void;
  setVotedQueen: (id: string) => void;
  hidden: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const voteKing = async () => {
    const lt = toast.loading("Voting for " + name + " as King");
    startTransition(async () => {
      const res = await vote(id, "king");
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success(res.success || "Success");
      setVotedKing(id);
      toast.dismiss(lt);
    });
  };

  const voteQueen = async () => {
    const lt = toast.loading("Voting for " + name + " as Queen");
    startTransition(async () => {
      const res = await vote(id, "queen");
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success(res.success || "Success");
      setVotedQueen(id);
      toast.dismiss(lt);
    });
  };
  return (
    <div
      className={`${styles.candidate} ${hidden ? styles.hidden : styles.show}`}
    >
      <div className={styles.candidateInfo}>
        <h3>{name}</h3>
        <p>
          Year {year} {interpretTrack(track)}
        </p>
      </div>
      <div className={styles.candidateActions}>
        <StylisedBtn
          onClick={() => voteKing()}
          disabled={!!votedKing || isPending || votedQueen === id}
        >
          Vote King
        </StylisedBtn>
        <StylisedBtn
          onClick={() => voteQueen()}
          disabled={!!votedQueen || isPending || votedKing === id}
        >
          Vote Queen
        </StylisedBtn>
      </div>
    </div>
  );
}

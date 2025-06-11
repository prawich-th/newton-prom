"use client";

import { User } from "@/generated/prisma";
import Candidate from "./candidate";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import StylisedBtn from "@/components/stylisedBtn";
import { disconnectVote } from "@/actions/voteActions";

export default function CandidateList({
  allTickets,
  votedKing,
  votedQueen,
}: {
  allTickets: User[];
  votedKing: string | null;
  votedQueen: string | null;
}) {
  const [filterName, setFilterName] = useState<string>("");
  const [allIDs, setAllIDs] = useState<string[]>(
    allTickets.map((ticket) => ticket.id)
  );
  const [isVotedKing, setIsVotedKing] = useState<string | null>(votedKing);
  const [isVotedQueen, setIsVotedQueen] = useState<string | null>(votedQueen);

  useEffect(() => {
    if (!filterName) setAllIDs(allTickets.map((ticket) => ticket.id));
    const reg = new RegExp(filterName, "i");
    const filteredIDs = allTickets.filter((ticket) => {
      return reg.test(
        `${ticket.name} ${ticket.year} ${ticket.track} ${ticket.room}`
      );
    });
    setAllIDs(filteredIDs.map((ticket) => ticket.id));
  }, [filterName]);

  useEffect(() => {
    setIsVotedKing(votedKing);
    setIsVotedQueen(votedQueen);
  }, [votedKing, votedQueen]);

  return (
    <>
      <input
        type="text"
        placeholder="Search (Nickname, Full Name, Year, Track, Room)"
        value={filterName}
        onChange={(e) => setFilterName(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          borderRadius: "0.5rem",
          border: "2px solid #ccc",
          fontFamily: "Inter, sans-serif",
          fontSize: "1rem",
        }}
      />
      <div className={styles.candidates}>
        {allTickets.map((candidate) => (
          <Candidate
            key={candidate.id}
            name={candidate.name || ""}
            id={candidate.id}
            year={candidate.year}
            track={candidate.track}
            votedKing={isVotedKing}
            votedQueen={isVotedQueen}
            setVotedKing={setIsVotedKing}
            setVotedQueen={setIsVotedQueen}
            hidden={!allIDs.includes(candidate.id)}
          />
        ))}
      </div>
    </>
  );
}

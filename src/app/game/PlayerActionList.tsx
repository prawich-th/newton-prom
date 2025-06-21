"use client";

import { useEffect, useState } from "react";
import PlayerActionCard from "./PlayerActionCard";
import styles from "../vote/page.module.scss";

export interface Player {
  id: string;
  name: string;
  year: number;
  track: string;
  disabled: boolean;
}

export default function PlayerActionList({
  players,
  onAction,
  actionType, // "kill" | "arrest" | "vote"
  actionLabel,
  alreadyActedId,
}: {
  players: Player[];
  onAction: (id: string) => void;
  actionType: "kill" | "arrest" | "vote";
  actionLabel: string;
  alreadyActedId?: string | null;
}) {
  const [filterName, setFilterName] = useState<string>("");
  const [allIDs, setAllIDs] = useState<string[]>(players.map((p) => p.id));

  useEffect(() => {
    if (!filterName) setAllIDs(players.map((p) => p.id));
    const reg = new RegExp(filterName, "i");
    const filteredIDs = players.filter((p) => {
      return reg.test(`${p.name} ${p.year} ${p.track}`);
    });
    setAllIDs(filteredIDs.map((p) => p.id));
  }, [filterName, players]);

  return (
    <>
      <input
        type="text"
        placeholder="Search (Name, Year, Track)"
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
        {players.map((player) => (
          <PlayerActionCard
            key={player.id}
            name={player.name}
            id={player.id}
            year={player.year}
            track={player.track}
            actionType={actionType}
            disabled={
              player.disabled ||
              (alreadyActedId !== undefined && alreadyActedId !== null)
            }
            onAction={onAction}
            hidden={!allIDs.includes(player.id)}
            actionLabel={actionLabel}
          />
        ))}
      </div>
    </>
  );
}

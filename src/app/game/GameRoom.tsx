"use client";

import { useState, useEffect } from "react";
import {
  startGame,
  getGame,
  getCurrentUserParticipant,
  killPlayer,
  arrestPlayer,
  voteForMayor,
  endGame,
  resetGlobalGame,
} from "@/actions/gameActions";
import toast from "react-hot-toast";
import PlayerActionList, { Player } from "./PlayerActionList";
import PlayerActionCard from "./PlayerActionCard";
import StylisedBtn from "@/components/stylisedBtn";
import InfoField from "@/components/infoFields";

interface Game {
  id: string;
  name: string;
  status: "WAITING" | "PLAYING" | "VOTING" | "ENDED";
  createdAt: Date;
  participants: any[];
  kills: any[];
  arrests: any[];
  mayorVotes: any[];
}

interface GameRoomProps {
  game: Game;
  onBackToLobby: () => void;
  onGameUpdate: () => void;
}

export function GameRoom({ game, onBackToLobby, onGameUpdate }: GameRoomProps) {
  const [currentGame, setCurrentGame] = useState<Game>(game);
  const [userParticipant, setUserParticipant] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [voteTarget, setVoteTarget] = useState<string | null>(null);
  const [ticketType, setTicketType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [voteSearchTerm, setVoteSearchTerm] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState<any[]>([]);

  useEffect(() => {
    loadGameData();
  }, []);

  // Filter players based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPlayers(currentGame.participants);
    } else {
      const reg = new RegExp(searchTerm, "i");
      const filtered = currentGame.participants.filter((participant) => {
        return reg.test(
          `${participant.user.name} ${participant.user.year} ${
            participant.user.track
          } ${participant.user.room || ""}`
        );
      });
      setFilteredPlayers(filtered);
    }
  }, [searchTerm, currentGame.participants]);

  const loadGameData = async () => {
    try {
      console.log("DEBUG: GameRoom - Starting loadGameData");
      const [gameResult, participantResult] = await Promise.all([
        getGame(game.id),
        getCurrentUserParticipant(game.id),
      ]);

      console.log("DEBUG: GameRoom - gameResult:", gameResult);
      console.log("DEBUG: GameRoom - participantResult:", participantResult);

      if (gameResult.success) {
        setCurrentGame(gameResult.game);
      } else {
        console.error("DEBUG: GameRoom - Game fetch failed:", gameResult.error);
        toast.error("Failed to fetch game data");
      }

      if (participantResult.success) {
        setUserParticipant(participantResult.participant);
      } else {
        console.error(
          "DEBUG: GameRoom - Participant fetch failed:",
          participantResult.error
        );
        toast.error("Failed to fetch participant data");
      }
    } catch (error) {
      console.error("Error loading game data:", error);
      toast.error("Failed to load game data. Please try again.");
    }
  };

  const handleStartGame = async () => {
    setLoading(true);
    const result = await startGame(game.id);
    setLoading(false);

    if (result.success) {
      toast.success("Game started!");
      loadGameData();
    } else {
      toast.error(result.error || "Failed to start game");
    }
  };

  const handleKillPlayer = async () => {
    if (!selectedPlayer) {
      toast.error("Please select a player to kill");
      return;
    }

    setLoading(true);
    const result = await killPlayer(selectedPlayer, game.id);
    setLoading(false);

    if (result.success) {
      toast.success("Player killed!");
      setSelectedPlayer(null);
      loadGameData();
    } else {
      toast.error(result.error || "Failed to kill player");
    }
  };

  const handleArrestPlayer = async () => {
    if (!selectedPlayer) {
      toast.error("Please select a player to arrest");
      return;
    }

    setLoading(true);
    const result = await arrestPlayer(selectedPlayer, game.id);
    setLoading(false);

    if (result.success) {
      toast.success(
        `Player arrested! ${
          result.isCorrect ? "Correct arrest!" : "Incorrect arrest!"
        }`
      );
      setSelectedPlayer(null);
      loadGameData();
    } else {
      toast.error(result.error || "Failed to arrest player");
    }
  };

  const handleVoteForMayor = async () => {
    if (!voteTarget) {
      toast.error("Please select who you think is the mayor");
      return;
    }

    setLoading(true);
    const result = await voteForMayor(voteTarget, game.id);
    setLoading(false);

    if (result.success) {
      toast.success("Vote recorded!");
      setVoteTarget(null);
      loadGameData();
    } else {
      toast.error(result.error || "Failed to vote");
    }
  };

  const handleEndGame = async () => {
    setLoading(true);
    const result = await endGame(game.id);
    setLoading(false);

    if (result.success) {
      toast.success(`Game ended! Winner: ${result.result.winner}`);
      loadGameData();
    } else {
      toast.error(result.error || "Failed to end game");
    }
  };

  const handleResetGame = async () => {
    if (
      !confirm(
        "Are you sure you want to reset the global game? This will remove all players and game data."
      )
    ) {
      return;
    }

    setLoading(true);
    const result = await resetGlobalGame();
    setLoading(false);

    if (result.success) {
      toast.success("Global game reset successfully!");
      onGameUpdate();
    } else {
      toast.error(result.error || "Failed to reset game");
    }
  };

  const handleManualRefresh = () => {
    loadGameData();
    toast.success("Game refreshed");
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "MAYOR":
        return "text-yellow-400";
      case "POLICE":
        return "text-blue-400";
      case "SYNDICATE":
        return "text-red-400";
      case "CITIZEN":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const isPlayerDead = (playerId: string) => {
    return currentGame.kills.some((kill) => kill.victimId === playerId);
  };

  const isPlayerArrested = (playerId: string) => {
    return currentGame.arrests.some((arrest) => arrest.arrestedId === playerId);
  };

  const hasVoted = (playerId: string) => {
    return currentGame.mayorVotes.some((vote) => vote.voterId === playerId);
  };

  const isSuperAdmin = ticketType === "Super Admin";

  return (
    <div className="max-w-6xl mx-auto">
      {/* Game Header */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <StylisedBtn onClick={handleManualRefresh}>Refresh Game</StylisedBtn>
        </div>
      </div>

      {/* Role Display */}
      {userParticipant && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#fff",
              marginBottom: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            Your Role
          </h3>
          <InfoField value={userParticipant.role} />
          {userParticipant.role === "SYNDICATE" && (
            <InfoField value={`Remaining kills: ${userParticipant.knives}`} />
          )}
          {userParticipant.role === "POLICE" && (
            <InfoField
              value={`Remaining arrests: ${userParticipant.arrests}`}
            />
          )}
        </div>
      )}

      {currentGame.status === "PLAYING" && userParticipant && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <InfoField value="Game in Progress" type="success" />
        </div>
      )}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h3
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#fff",
            marginBottom: "0.5rem",
          }}
        >
          Players
        </h3>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search (Name, Year, Track, Room)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            fontFamily: "Inter, sans-serif",
            width: "100%",
            padding: "0.25rem",
            borderRadius: "0.5rem",
            border: "1px solid #333",
            backgroundColor: "#111",
            color: "#fff",
            marginBottom: "0.5rem",
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlayers.map((participant) => (
            <PlayerActionCard
              key={participant.userId}
              id={participant.userId}
              name={participant.user.name}
              year={participant.user.year}
              track={participant.user.track}
              actionType="vote"
              disabled={true}
              onAction={() => {}}
              hidden={false}
              actionLabel=""
            />
          ))}
        </div>
      </div>
    </div>
  );
}

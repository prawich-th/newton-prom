"use client";

import { useState, useEffect } from "react";
import {
  getOrCreateGlobalGame,
  startGame,
  endGame,
  resetGlobalGame,
} from "@/actions/gameActions";
import toast from "react-hot-toast";
import InfoField from "@/components/infoFields";

interface Game {
  id: string;
  name: string;
  status: "WAITING" | "PLAYING" | "VOTING" | "ENDED";
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  participants: any[];
  kills: any[];
  arrests: any[];
  mayorVotes: any[];
}

export function GameAdminPanel() {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadGame();
  }, []);

  const loadGame = async () => {
    try {
      setLoading(true);
      const result = await getOrCreateGlobalGame();
      if (result.success) {
        setGame(result.game as unknown as Game);
      } else {
        toast.error("Failed to load game");
      }
    } catch (error) {
      console.error("Error loading game:", error);
      toast.error("Failed to load game");
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = async () => {
    if (!game) return;

    setActionLoading(true);
    const result = await startGame(game.id);
    setActionLoading(false);

    if (result.success) {
      toast.success("Game started successfully!");
      loadGame();
    } else {
      toast.error(result.error || "Failed to start game");
    }
  };

  const handleEndGame = async () => {
    if (!game) return;

    setActionLoading(true);
    const result = await endGame(game.id);
    setActionLoading(false);

    if (result.success) {
      toast.success(`Game ended! Winner: ${result.result.winner}`);
      loadGame();
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

    setActionLoading(true);
    const result = await resetGlobalGame();
    setActionLoading(false);

    if (result.success) {
      toast.success("Game reset successfully!");
      loadGame();
    } else {
      toast.error(result.error || "Failed to reset game");
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "WAITING":
        return "text-blue-400";
      case "PLAYING":
        return "text-green-400";
      case "VOTING":
        return "text-purple-400";
      case "ENDED":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const isPlayerDead = (playerId: string) => {
    return game?.kills.some((kill) => kill.victimId === playerId) || false;
  };

  const isPlayerArrested = (playerId: string) => {
    return (
      game?.arrests.some((arrest) => arrest.arrestedId === playerId) || false
    );
  };

  const hasVoted = (playerId: string) => {
    return game?.mayorVotes.some((vote) => vote.voterId === playerId) || false;
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading game data...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Game Not Found
          </h2>
          <p className="text-gray-300">
            No global game found. Please check the game configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Status Card */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Game Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Status</h3>
            <p className={`text-xl font-bold ${getStatusColor(game.status)}`}>
              {game.status.replace("_", " ")}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Players</h3>
            <InfoField value={game.participants.length.toString()} />
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Created</h3>
            <InfoField value={new Date(game.createdAt).toLocaleDateString()} />
          </div>
        </div>
      </div>

      {/* Role Distribution Card */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          Role Distribution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Mayor</h3>
            <InfoField
              value={game.participants
                .filter((p) => p.role === "MAYOR")
                .length.toString()}
            />
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Police</h3>
            <InfoField
              value={game.participants
                .filter((p) => p.role === "POLICE")
                .length.toString()}
            />
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Syndicate</h3>
            <InfoField
              value={game.participants
                .filter((p) => p.role === "SYNDICATE")
                .length.toString()}
            />
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Citizens</h3>
            <InfoField
              value={game.participants
                .filter((p) => p.role === "CITIZEN")
                .length.toString()}
            />
          </div>
        </div>
      </div>

      {/* Admin Controls */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Admin Controls</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleStartGame}
            disabled={
              actionLoading ||
              game.status === "PLAYING" ||
              game.status === "VOTING"
            }
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            {actionLoading ? "Starting..." : "Start Game"}
          </button>

          <button
            onClick={handleEndGame}
            disabled={actionLoading || game.status !== "PLAYING"}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            {actionLoading ? "Ending..." : "End Game"}
          </button>

          <button
            onClick={handleResetGame}
            disabled={actionLoading}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            {actionLoading ? "Resetting..." : "Reset Game"}
          </button>

          <button
            onClick={loadGame}
            disabled={actionLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            {actionLoading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </div>

      {/* Game Statistics */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Game Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Kills</h3>
            <p className="text-2xl font-bold text-red-400">
              {game.kills.length}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Arrests</h3>
            <p className="text-2xl font-bold text-blue-400">
              {game.arrests.length}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Votes</h3>
            <p className="text-2xl font-bold text-green-400">
              {game.mayorVotes.length}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              Accepted Roles
            </h3>
            <p className="text-2xl font-bold text-yellow-400">
              {game.participants.filter((p) => p.accepted).length}
            </p>
          </div>
        </div>
      </div>

      {/* Players List */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">All Players</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {game.participants.map((participant) => (
            <div
              key={participant.userId}
              className={`p-4 rounded-lg border ${
                isPlayerDead(participant.userId)
                  ? "bg-red-900/50 border-red-500"
                  : isPlayerArrested(participant.userId)
                  ? "bg-blue-900/50 border-blue-500"
                  : "bg-white/5 border-white/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-white">
                  {participant.user.name}
                </h4>
                <span
                  className={`text-sm font-medium ${getRoleColor(
                    participant.role
                  )}`}
                >
                  {participant.role}
                </span>
              </div>
              <div className="text-sm text-gray-300 space-y-1">
                <p>Email: {participant.user.email}</p>
                {participant.role === "SYNDICATE" && (
                  <p>Knives: {participant.knives}</p>
                )}
                {participant.role === "POLICE" && (
                  <p>
                    Arrests: {participant.correctArrests} correct,{" "}
                    {participant.incorrectArrests} incorrect
                  </p>
                )}
                {isPlayerDead(participant.userId) && (
                  <span className="text-red-400 block">DEAD</span>
                )}
                {isPlayerArrested(participant.userId) && (
                  <span className="text-blue-400 block">ARRESTED</span>
                )}
                {hasVoted(participant.userId) && (
                  <span className="text-green-400 block">VOTED</span>
                )}
                {participant.accepted && (
                  <span className="text-yellow-400 block">ACCEPTED</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

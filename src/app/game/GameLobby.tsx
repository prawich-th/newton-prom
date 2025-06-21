"use client";

import { useState, useEffect } from "react";
import { ensureUserInGlobalGame } from "@/actions/gameActions";
import { GameRoom } from "./GameRoom";

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

export function GameLobby() {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGlobalGame();
  }, []);

  const loadGlobalGame = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, ensure user is in the global game
      const ensureResult = await ensureUserInGlobalGame();
      if (!ensureResult.success) {
        setError(
          "error" in ensureResult && ensureResult.error
            ? ensureResult.error
            : "Failed to join global game"
        );
        return;
      }

      setGame(ensureResult.game as unknown as Game);
    } catch (err) {
      setError("Failed to load game");
      console.error("Error loading global game:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLobby = () => {
    loadGlobalGame();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading Mayor's Gambit...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="text-center">
            <p className="text-red-400 text-lg mb-4">Error: {error}</p>
            <button
              onClick={loadGlobalGame}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="text-center">
            <p className="text-white text-lg">No game available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GameRoom
      game={game}
      onBackToLobby={handleBackToLobby}
      onGameUpdate={loadGlobalGame}
    />
  );
}

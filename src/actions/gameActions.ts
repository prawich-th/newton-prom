"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { getUserByEmail } from "@/data/user";

// Global game name for Mayor's Gambit
const GLOBAL_GAME_NAME = "Mayor's Gambit - Global Game";

export async function createGame(name: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Not authenticated" };
    }

    if (!session?.user?.email) {
      return { error: "No email found in session" };
    }

    const user = await getUserByEmail(session?.user?.email);
    console.log("DEBUG: getCurrentUserParticipant - userid:", user?.id);
    if (!user?.id) {
      return { error: "User ID not found" };
    }

    console.log("Creating game:", { name, userId: user?.id });

    const game = await prisma.game.create({
      data: {
        name,
        status: "WAITING",
      },
    });

    console.log("Created game:", game.id);

    revalidatePath("/game");
    return { success: "Game created", game };
  } catch (error) {
    console.error("Error creating game:", error);
    return {
      error: `Failed to create game: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export async function joinGame(gameId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Not authenticated" };
    }

    if (!session?.user?.email) {
      return { error: "No email found in session" };
    }

    const user = await getUserByEmail(session?.user?.email);
    console.log("DEBUG: getCurrentUserParticipant - userid:", user?.id);
    if (!user?.id) {
      return { error: "User ID not found" };
    }

    console.log("Joining game:", { gameId, userId: user.id });

    // Check if user is already in the game
    const existingParticipant = await prisma.gameParticipant.findUnique({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId,
        },
      },
    });

    if (existingParticipant) {
      return { error: "Already joined this game" };
    }

    // Get all participants to determine role distribution
    const participants = await prisma.gameParticipant.findMany({
      where: { gameId },
      include: { user: true },
    });

    console.log("Current participants:", participants.length);

    // Count existing roles
    const roleCounts = {
      MAYOR: participants.filter((p: any) => p.role === "MAYOR").length,
      POLICE: participants.filter((p: any) => p.role === "POLICE").length,
      SYNDICATE: participants.filter((p: any) => p.role === "SYNDICATE").length,
      CITIZEN: participants.filter((p: any) => p.role === "CITIZEN").length,
    };

    console.log("Role counts:", roleCounts);

    // Determine role based on distribution
    let role: "MAYOR" | "POLICE" | "SYNDICATE" | "CITIZEN";

    if (roleCounts.MAYOR === 0) {
      role = "MAYOR";
    } else if (roleCounts.POLICE < Math.ceil(participants.length * 0.25)) {
      role = "POLICE";
    } else if (roleCounts.SYNDICATE < Math.ceil(participants.length * 0.25)) {
      role = "SYNDICATE";
    } else {
      role = "CITIZEN";
    }

    console.log("Assigned role:", role);

    // Set initial knives for syndicate
    const knives = role === "SYNDICATE" ? 3 : 0;

    const participant = await prisma.gameParticipant.create({
      data: {
        userId: user.id,
        gameId,
        role,
        knives,
        accepted: true,
        acceptedAt: new Date(),
      },
      include: { user: true },
    });

    console.log("Created participant:", participant.id);

    revalidatePath("/game");
    return { success: "Joined game", participant };
  } catch (error) {
    console.error("Error joining game:", error);
    return {
      error: `Failed to join game: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export async function acceptRole(gameId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Not authenticated" };
    }

    if (!session?.user?.email) {
      return { error: "No email found in session" };
    }

    const user = await getUserByEmail(session?.user?.email);
    console.log("DEBUG: getCurrentUserParticipant - userid:", user?.id);
    if (!user?.id) {
      return { error: "User ID not found" };
    }

    const participant = await prisma.gameParticipant.update({
      where: {
        userId_gameId: {
          userId: user.id!,
          gameId,
        },
      },
      data: {
        accepted: true,
        acceptedAt: new Date(),
      },
      include: { user: true },
    });

    revalidatePath("/game");
    return { success: "Role accepted", participant };
  } catch (error) {
    console.error("Error accepting role:", error);
    return { error: "Failed to accept role" };
  }
}

export async function startGame(gameId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Not authenticated" };
    }

    if (!session?.user?.email) {
      return { error: "No email found in session" };
    }

    const user = await getUserByEmail(session?.user?.email);
    console.log("DEBUG: getCurrentUserParticipant - userid:", user?.id);
    if (!user?.id) {
      return { error: "User ID not found" };
    }

    // Get all participants
    const participants = await prisma.gameParticipant.findMany({
      where: { gameId },
    });

    // Check if there are enough players (at least 4 for a balanced game)
    if (participants.length < 4) {
      return { error: "Need at least 4 players to start the game" };
    }

    const game = await prisma.game.update({
      where: { id: gameId },
      data: {
        status: "PLAYING",
        startedAt: new Date(),
      },
    });

    revalidatePath("/game");
    return { success: "Game started", game };
  } catch (error) {
    console.error("Error starting game:", error);
    return { error: "Failed to start game" };
  }
}

export async function killPlayer(victimId: string, gameId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Not authenticated" };
    }

    if (!session?.user?.email) {
      return { error: "No email found in session" };
    }

    const user = await getUserByEmail(session?.user?.email);
    console.log("DEBUG: getCurrentUserParticipant - userid:", user?.id);
    if (!user?.id) {
      return { error: "User ID not found" };
    }

    // Check if killer is syndicate and has knives
    const killer = await prisma.gameParticipant.findUnique({
      where: {
        userId_gameId: {
          userId: user.id!,
          gameId,
        },
      },
    });

    if (!killer || killer.role !== "SYNDICATE" || killer.knives <= 0) {
      return { error: "Cannot kill: not syndicate or no knives left" };
    }

    // Check if victim is alive (not already killed)
    const existingKill = await prisma.gameKill.findFirst({
      where: {
        victimId,
        gameId,
      },
    });

    if (existingKill) {
      return { error: "Player is already dead" };
    }

    // Create kill record and reduce knives
    const kill = await prisma.gameKill.create({
      data: {
        killerId: user.id!,
        victimId,
        gameId,
      },
    });

    await prisma.gameParticipant.update({
      where: {
        userId_gameId: {
          userId: user.id!,
          gameId,
        },
      },
      data: {
        knives: killer.knives - 1,
      },
    });

    revalidatePath("/game");
    return { success: "Player killed", kill };
  } catch (error) {
    console.error("Error killing player:", error);
    return { error: "Failed to kill player" };
  }
}

export async function arrestPlayer(arrestedId: string, gameId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Not authenticated" };
    }

    if (!session?.user?.email) {
      return { error: "No email found in session" };
    }

    const user = await getUserByEmail(session?.user?.email);
    console.log("DEBUG: getCurrentUserParticipant - userid:", user?.id);
    if (!user?.id) {
      return { error: "User ID not found" };
    }

    // Check if arrester is police
    const arrester = await prisma.gameParticipant.findUnique({
      where: {
        userId_gameId: {
          userId: user.id!,
          gameId,
        },
      },
    });

    if (!arrester || arrester.role !== "POLICE") {
      return { error: "Only police can arrest" };
    }

    // Check if arrested person is already arrested
    const existingArrest = await prisma.gameArrest.findFirst({
      where: {
        arrestedId,
        gameId,
      },
    });

    if (existingArrest) {
      return { error: "Player is already arrested" };
    }

    // Check if arrested person is actually syndicate
    const arrested = await prisma.gameParticipant.findUnique({
      where: {
        userId_gameId: {
          userId: arrestedId,
          gameId,
        },
      },
    });

    const isCorrect = arrested?.role === "SYNDICATE";

    // Create arrest record
    const arrest = await prisma.gameArrest.create({
      data: {
        arresterId: user.id!,
        arrestedId,
        gameId,
        isCorrect,
      },
    });

    // Update police stats
    await prisma.gameParticipant.update({
      where: {
        userId_gameId: {
          userId: user.id!,
          gameId,
        },
      },
      data: {
        correctArrests: arrester.correctArrests + (isCorrect ? 1 : 0),
        incorrectArrests: arrester.incorrectArrests + (isCorrect ? 0 : 1),
      },
    });

    revalidatePath("/game");
    return { success: "Player arrested", arrest, isCorrect };
  } catch (error) {
    console.error("Error arresting player:", error);
    return { error: "Failed to arrest player" };
  }
}

export async function voteForMayor(votedForId: string, gameId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Not authenticated" };
    }

    if (!session?.user?.email) {
      return { error: "No email found in session" };
    }

    const user = await getUserByEmail(session?.user?.email);
    console.log("DEBUG: getCurrentUserParticipant - userid:", user?.id);
    if (!user?.id) {
      return { error: "User ID not found" };
    }

    // Check if voter is citizen
    const voter = await prisma.gameParticipant.findUnique({
      where: {
        userId_gameId: {
          userId: user.id!,
          gameId,
        },
      },
    });

    if (!voter || voter.role !== "CITIZEN") {
      return { error: "Only citizens can vote for mayor" };
    }

    // Check if already voted
    const existingVote = await prisma.mayorVote.findUnique({
      where: {
        voterId_gameId: {
          voterId: user.id!,
          gameId,
        },
      },
    });

    if (existingVote) {
      return { error: "Already voted" };
    }

    const vote = await prisma.mayorVote.create({
      data: {
        voterId: user.id!,
        votedForId,
        gameId,
      },
    });

    revalidatePath("/game");
    return { success: "Vote recorded", vote };
  } catch (error) {
    console.error("Error voting for mayor:", error);
    return { error: "Failed to vote" };
  }
}

export async function endGame(gameId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Not authenticated" };
    }

    if (!session?.user?.email) {
      return { error: "No email found in session" };
    }

    const user = await getUserByEmail(session?.user?.email);
    console.log("DEBUG: getCurrentUserParticipant - userid:", user?.id);
    if (!user?.id) {
      return { error: "User ID not found" };
    }

    // Get game data
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        participants: {
          include: { user: true },
        },
        kills: true,
        arrests: true,
        mayorVotes: true,
      },
    });

    if (!game) {
      return { error: "Game not found" };
    }

    // Find mayor
    const mayor = game.participants.find((p: any) => p.role === "MAYOR");
    if (!mayor) {
      return { error: "Mayor not found" };
    }

    // Check if mayor is killed
    const mayorKilled = game.kills.some(
      (k: any) => k.victimId === mayor.userId
    );

    // Count votes for mayor
    const votesForMayor = game.mayorVotes.filter(
      (v: any) => v.votedForId === mayor.userId
    ).length;
    const totalVotes = game.mayorVotes.length;

    // Calculate police stats
    const policeStats = game.participants
      .filter((p: any) => p.role === "POLICE")
      .reduce(
        (acc: any, p: any) => ({
          correct: acc.correct + p.correctArrests,
          incorrect: acc.incorrect + p.incorrectArrests,
        }),
        { correct: 0, incorrect: 0 }
      );

    // Determine winner
    let winner: string;
    if (mayorKilled) {
      winner = "SYNDICATE";
    } else if (votesForMayor > totalVotes / 2) {
      winner = "CITIZEN";
    } else if (policeStats.correct > policeStats.incorrect) {
      winner = "POLICE";
    } else {
      winner = "SYNDICATE";
    }

    // Update game status
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        status: "ENDED",
        endedAt: new Date(),
      },
    });

    revalidatePath("/game");
    return {
      success: "Game ended",
      game: updatedGame,
      result: {
        winner,
        mayorKilled,
        votesForMayor,
        totalVotes,
        policeStats,
      },
    };
  } catch (error) {
    console.error("Error ending game:", error);
    return { error: "Failed to end game" };
  }
}

export async function getGame(gameId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Not authenticated" };
    }

    if (!session?.user?.email) {
      return { error: "No email found in session" };
    }

    const user = await getUserByEmail(session?.user?.email);
    console.log("DEBUG: getCurrentUserParticipant - userid:", user?.id);
    if (!user?.id) {
      return { error: "User ID not found" };
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        participants: {
          include: { user: true },
        },
        kills: true,
        arrests: true,
        mayorVotes: true,
      },
    });

    if (!game) {
      return { error: "Game not found" };
    }

    revalidatePath("/game");
    return { success: "Game retrieved", game };
  } catch (error) {
    console.error("Error getting game:", error);
    return { error: "Failed to get game" };
  }
}

export async function getCurrentUserParticipant(gameId: string) {
  try {
    const session = await auth();
    console.log("DEBUG: getCurrentUserParticipant - session:", session);
    console.log(
      "DEBUG: getCurrentUserParticipant - session.user:",
      session?.user
    );

    if (!session?.user?.email) {
      return { error: "No email found in session" };
    }

    if (!session?.user?.email) {
      return { error: "No email found in session" };
    }

    const user = await getUserByEmail(session?.user?.email);
    console.log("DEBUG: getCurrentUserParticipant - userid:", user?.id);
    if (!user?.id) {
      return { error: "User ID not found" };
    }

    console.log(
      "DEBUG: getCurrentUserParticipant - Looking for participant with userId:",
      user.id,
      "gameId:",
      gameId
    );

    const participant = await prisma.gameParticipant.findUnique({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId,
        },
      },
      include: { user: true },
    });

    console.log(
      "DEBUG: getCurrentUserParticipant - Found participant:",
      participant
    );

    revalidatePath("/game");
    return { success: "Participant retrieved", participant };
  } catch (error) {
    console.error("Error getting participant:", error);
    return { error: "Failed to get participant" };
  }
}

export async function getAllGames() {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Not authenticated" };
    }

    const games = await prisma.game.findMany({
      include: {
        participants: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    revalidatePath("/game");
    return { success: "Games retrieved", games };
  } catch (error) {
    console.error("Error getting games:", error);
    return { error: "Failed to get games" };
  }
}

export async function getOrCreateGlobalGame() {
  try {
    // Try to find existing global game
    let game = await prisma.game.findFirst({
      where: { name: GLOBAL_GAME_NAME },
      include: {
        participants: {
          include: { user: true },
        },
        kills: true,
        arrests: true,
        mayorVotes: true,
      },
    });

    // If no global game exists, create one
    if (!game) {
      game = await prisma.game.create({
        data: {
          name: GLOBAL_GAME_NAME,
          status: "WAITING",
        },
        include: {
          participants: {
            include: { user: true },
          },
          kills: true,
          arrests: true,
          mayorVotes: true,
        },
      });
    }

    return { success: "Global game retrieved", game };
  } catch (error) {
    console.error("Error getting or creating global game:", error);
    return {
      error: `Failed to get or create global game: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export async function ensureUserInGlobalGame() {
  try {
    const session = await auth();
    console.log("DEBUG: session object in ensureUserInGlobalGame:", session);
    console.log(
      "DEBUG: session.user in ensureUserInGlobalGame:",
      session?.user
    );
    console.log(
      "DEBUG: session.user.email in ensureUserInGlobalGame:",
      session?.user?.email
    );
    console.log("DEBUG: user.id in ensureUserInGlobalGame:", session?.user?.id);

    if (!session?.user) {
      return { error: "Not authenticated" };
    }

    if (!session.user.email) {
      console.log("DEBUG: No email found in session");
      return { error: "User email not found in session" };
    }

    // Fetch user from DB using email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    console.log("DEBUG: Found user in database:", user);

    if (!user) {
      return { error: "User not found in database" };
    }

    // Get or create global game
    const globalGameResult = await getOrCreateGlobalGame();
    if (!globalGameResult.success) {
      return globalGameResult;
    }

    const game = globalGameResult.game;

    // Check if user is already in the game
    const existingParticipant = await prisma.gameParticipant.findUnique({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId: game.id,
        },
      },
    });

    console.log("DEBUG: Existing participant found:", existingParticipant);

    if (existingParticipant) {
      return { success: "User already in global game", game };
    }

    // Get all participants to determine role distribution
    const participants = await prisma.gameParticipant.findMany({
      where: { gameId: game.id },
      include: { user: true },
    });

    console.log("Current participants:", participants.length);

    // Count existing roles
    const roleCounts = {
      MAYOR: participants.filter((p: any) => p.role === "MAYOR").length,
      POLICE: participants.filter((p: any) => p.role === "POLICE").length,
      SYNDICATE: participants.filter((p: any) => p.role === "SYNDICATE").length,
      CITIZEN: participants.filter((p: any) => p.role === "CITIZEN").length,
    };

    console.log("Role counts:", roleCounts);

    // Determine role based on distribution
    let role: "MAYOR" | "POLICE" | "SYNDICATE" | "CITIZEN";

    if (roleCounts.MAYOR === 0) {
      role = "MAYOR";
    } else if (roleCounts.POLICE < Math.ceil(participants.length * 0.25)) {
      role = "POLICE";
    } else if (roleCounts.SYNDICATE < Math.ceil(participants.length * 0.25)) {
      role = "SYNDICATE";
    } else {
      role = "CITIZEN";
    }

    console.log("Assigned role:", role);

    // Set initial knives for syndicate
    const knives = role === "SYNDICATE" ? 3 : 0;

    const participant = await prisma.gameParticipant.create({
      data: {
        userId: user.id,
        gameId: game.id,
        role,
        knives,
        accepted: true,
        acceptedAt: new Date(),
      },
      include: { user: true },
    });

    console.log("Created participant:", participant.id);

    // Refresh game data
    const updatedGame = await prisma.game.findUnique({
      where: { id: game.id },
      include: {
        participants: {
          include: { user: true },
        },
        kills: true,
        arrests: true,
        mayorVotes: true,
      },
    });

    revalidatePath("/game");
    return { success: "Joined global game", game: updatedGame };
  } catch (error) {
    console.error("Error ensuring user in global game:", error);
    return {
      error: `Failed to ensure user in global game: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export async function resetGlobalGame() {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Not authenticated" };
    }

    // Find the global game
    const globalGame = await prisma.game.findFirst({
      where: { name: GLOBAL_GAME_NAME },
    });

    if (!globalGame) {
      return { error: "Global game not found" };
    }

    // Delete all game-related data
    await prisma.mayorVote.deleteMany({
      where: { gameId: globalGame.id },
    });

    await prisma.gameArrest.deleteMany({
      where: { gameId: globalGame.id },
    });

    await prisma.gameKill.deleteMany({
      where: { gameId: globalGame.id },
    });

    await prisma.gameParticipant.deleteMany({
      where: { gameId: globalGame.id },
    });

    // Reset the game status
    const resetGame = await prisma.game.update({
      where: { id: globalGame.id },
      data: {
        status: "WAITING",
        startedAt: null,
        endedAt: null,
      },
    });

    revalidatePath("/game");
    return { success: "Global game reset", game: resetGame };
  } catch (error) {
    console.error("Error resetting global game:", error);
    return {
      error: `Failed to reset global game: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

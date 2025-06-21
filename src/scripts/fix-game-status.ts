import prisma from "../lib/prisma";

async function fixGameStatus() {
  try {
    console.log("Fixing game status...");

    // Update any games with ACCEPTING_ROLES to WAITING
    const updatedGames = await prisma.game.updateMany({
      where: {
        status: "ACCEPTING_ROLES" as any,
      },
      data: {
        status: "WAITING",
      },
    });

    console.log(
      `Updated ${updatedGames.count} games from ACCEPTING_ROLES to WAITING`
    );

    // Check if there are any remaining games with ACCEPTING_ROLES
    const remainingGames = await prisma.game.findMany({
      where: {
        status: "ACCEPTING_ROLES" as any,
      },
    });

    if (remainingGames.length > 0) {
      console.log(
        `Warning: ${remainingGames.length} games still have ACCEPTING_ROLES status`
      );
    } else {
      console.log("All games have been updated successfully");
    }
  } catch (error) {
    console.error("Error fixing game status:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script if executed directly
if (require.main === module) {
  fixGameStatus();
}

export { fixGameStatus };

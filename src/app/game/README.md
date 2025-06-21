# Mayor's Gambit Game

## Overview

Mayor's Gambit is a global social deduction game where all players participate in the same game. Players are assigned different roles and must work together or against each other to achieve their objectives.

## Global Game

- **Single Game Instance**: All players participate in the same game
- **Automatic Joining**: Players are automatically added to the game when they first access it
- **Real-time Updates**: Game state updates in real-time for all participants
- **Persistent Game**: The game continues until manually reset by an administrator

## Game Roles

### 1. Mayor (1 player)

- **Objective**: Stay alive and hope citizens vote for you correctly
- **Special**: Only one mayor per game
- **Win Condition**: Citizens must vote for you correctly AND you must be alive

### 2. Police (25% of players)

- **Objective**: Arrest syndicate members
- **Special**: Can arrest players they suspect are syndicate
- **Win Condition**: More correct arrests than incorrect arrests (if mayor is alive but not voted correctly)

### 3. Syndicate (25% of players)

- **Objective**: Kill the mayor
- **Special**: Each syndicate member has 3 knives to kill players
- **Win Condition**: Kill the mayor OR have more incorrect police arrests than correct ones

### 4. Citizens (50% of players)

- **Objective**: Vote for the correct mayor
- **Special**: Can observe the game and vote at the end
- **Win Condition**: Vote for the correct mayor (if mayor is alive)

## Game Phases

### 1. Waiting

- Players automatically join the global game
- Roles are automatically assigned based on distribution
- Players can click "Join Game" to participate

### 2. Playing

- Syndicate can kill players (3 knives per member)
- Police can arrest players they suspect
- Citizens observe and gather information
- Mayor tries to stay alive

### 3. Voting

- Only citizens can vote
- Citizens vote for who they think is the mayor
- One vote per citizen

### 4. Game End

- Results are revealed
- Winner is determined based on game conditions

## How to Play

1. **Join the Game**: Visit `/game` to automatically join the global game
2. **Click Join**: Click "Join Game" to participate and get your role
3. **Play Your Role**: Use your special abilities during the game
4. **Vote**: Citizens vote for the mayor at the end
5. **See Results**: Find out who won and why

## Win Conditions

- **Syndicate Wins**: If the mayor is killed OR if police have more incorrect arrests than correct ones
- **Police Wins**: If mayor is alive, not voted correctly, AND police have more correct arrests than incorrect ones
- **Citizens Win**: If mayor is alive AND citizens vote for the correct mayor

## Tips

- **Syndicate**: Be strategic with your kills. Try to kill the mayor without revealing yourself
- **Police**: Observe player behavior and make educated guesses about who is syndicate
- **Citizens**: Pay attention to who gets killed and arrested to figure out who the mayor might be
- **Mayor**: Stay low-key and try not to draw attention to yourself

## Administration

- **Reset Game**: Administrators can reset the global game to start fresh
- **Game Status**: Monitor the current game status and player participation
- **Real-time Updates**: All game actions are reflected immediately for all players

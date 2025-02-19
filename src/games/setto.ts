import type { Game } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";

export interface SetMemberships {
  [key: number]: number[];
}

export interface Connections {
  [key: string]: number[];
}

export interface MyGameState {
  previousCard: string | null; // the previous card that was played
  sets: number[]; // one set is required for victory
  grid: string[]; // 2D array of cards
  setMemberships: SetMemberships; // maps grid position to set membership
  connections: Connections;
}

export const Setto: Game<MyGameState> = {
  name: "setto",

  setup: ({ random }) => {
    const cards = ["a", "b", "c", "d"].flatMap((suit) => {
      return Array.from({ length: 4 }, (_, i) => `${suit}${i + 1}`);
    }); // a1...d4
    const shuffled = random.Shuffle(cards);
    const connections = createConnections(shuffled);
    return {
      previousCard: null,
      sets: Array(16).fill(0),
      grid: shuffled, // 4x4 grid
      setMemberships: {
        0: [0, 5, 9, 10],
        1: [1, 5, 10, 11],
        2: [2, 5, 11, 12],
        3: [3, 4, 5, 12],
        4: [0, 6, 10, 13],
        5: [1, 6, 9, 10, 11, 13, 14],
        6: [2, 4, 6, 11, 12, 14, 15],
        7: [3, 6, 12, 15],
        8: [0, 7, 13, 16],
        9: [1, 4, 7, 13, 14, 16, 17],
        10: [2, 7, 9, 14, 15, 17, 18],
        11: [3, 7, 15, 18],
        12: [0, 4, 8, 16],
        13: [1, 8, 16, 17],
        14: [2, 8, 17, 18],
        15: [3, 8, 9, 18],
      },
      connections,
    };
  },

  turn: {
    minMoves: 1,
    maxMoves: 1,
  },

  moves: {
    clickGridPos: ({ G, playerID }, id) => {
      if (!isValidMove(G, id)) {
        return INVALID_MOVE;
      }
      // add or subtract 1 from the set memberships of the grid position
      const sign = playerID === "0" ? 1 : -1;
      for (const membership of G.setMemberships[id]) {
        G.sets[membership] += 1 * sign;
      }
      // update the previous card
      G.previousCard = G.grid[id];
      // update the grid
      G.grid[id] = playerID;
    },
  },

  endIf: ({ G, ctx }) => {
    if (isVictory(G.sets)) {
      return { winner: ctx.currentPlayer };
    }
    if (isDefeat(G)) {
      return { winner: ctx.currentPlayer === "0" ? "1" : "0" };
    }
  },
};

function createConnections(cards: string[]): Connections {
  const connections: Connections = {};
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const suit = card[0];
    const value = card[1];
    if (!connections[suit]) connections[suit] = [];
    if (!connections[value]) connections[value] = [];
    connections[suit].push(i);
    connections[value].push(i);
  }
  return connections;
}

function isValidMove(G: MyGameState, id: number): boolean {
  if (G.previousCard === null) {
    // if first card, then it is valid
    return true;
  } else if (G.grid[id].length === 1) {
    // if grid position previously chosen, then it is invalid
    return false;
  } else if (
    // if card matches suit or value of previous card, then it is valid
    G.grid[id][0] === G.previousCard[0] ||
    G.grid[id][1] === G.previousCard[1]
  ) {
    return true;
  }
  // otherwise, it is invalid
  return false;
}

function isVictory(sets: number[]): boolean {
  // if any set is 4 or -4, then the current player has won
  return sets.some((i) => Math.abs(sets[i]) === 4);
}

function isDefeat(G: MyGameState): boolean {
  // if there are no legal moves, then the current player has lost
  let legalMoves = false;
  for (let i = 0; i < G.grid.length; i++) {
    if (isValidMove(G, i)) {
      legalMoves = true;
      break;
    }
  }
  return legalMoves;
}

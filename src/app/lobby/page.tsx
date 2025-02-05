"use client";

import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { useSearchParams } from "next/navigation";
import { TicTacToe } from "@/games/tictactoe";
import { TicTacToeBoard } from "@/boards/tictactoe";
import withProtectedRoute from "@/utils/withProtectedRoute";

const server = "http://localhost:3000/";

const TicTacToeClient = Client({
  game: TicTacToe,
  board: TicTacToeBoard,
  multiplayer: SocketIO({ server: server }),
});
const App = () => {
  const searchParams = useSearchParams();

  const playerID = searchParams.get("playerID") || "0";

  // @ts-ignore:
  return <TicTacToeClient playerID={playerID} />;
};

export default withProtectedRoute(App);

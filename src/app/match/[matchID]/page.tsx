"use client";

import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { TicTacToe } from "@/games/tictactoe";
import { TicTacToeBoard } from "@/boards/tictactoe";
import { useParams, useSearchParams } from "next/navigation";

const Match = () => {
  const { matchID } = useParams<{ matchID: string }>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const playerID = searchParams.get("playerID");
  const server = "http://localhost:3000/";

  const TicTacToeClient = Client({
    game: TicTacToe,
    board: TicTacToeBoard,
    multiplayer: SocketIO({ server: server }),
  });

  // @ts-ignore:
  return <TicTacToeClient matchID={matchID} credentials={token} playerID={playerID}/>;
};

export default Match;

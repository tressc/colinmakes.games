"use client";

import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { Setto } from "@/games/setto";
import { SettoBoard } from "@/boards/setto";
import { useParams, useSearchParams } from "next/navigation";

const Match = () => {
  const { matchID } = useParams<{ matchID: string }>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const playerID = searchParams.get("playerID");
  const server = process.env.NEXT_PUBLIC_API_URL!;

  const SettoClient = Client({
    game: Setto,
    board: SettoBoard,
    multiplayer: SocketIO({ server: server }),
  });

  // @ts-expect-error: valid component
  return (<SettoClient matchID={matchID} credentials={token} playerID={playerID}/>);
};

export default Match;

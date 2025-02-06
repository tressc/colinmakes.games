"use client";

import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { useSearchParams } from "next/navigation";
import { TicTacToe } from "@/games/tictactoe";
import { TicTacToeBoard } from "@/boards/tictactoe";
import { useContext, useEffect, useState } from "react";
import { LobbyClient } from "boardgame.io/client";
import { LobbyAPI } from "boardgame.io";
import withProtectedRoute from "@/utils/withProtectedRoute";
import { UserContext } from "@/contexts/userContext";

const Lobby = () => {
  const { user } = useContext(UserContext);

  const [matches, setMatches] = useState<LobbyAPI.Match[] | null>(null);

  // TODO: update server address
  const lobbyClient = new LobbyClient({ server: "http://localhost:8000" });

  useEffect(() => {
    // poll for list updated list of matches
    const interval = setInterval(async () => {
      const { matches } = await lobbyClient.listMatches("tic-tac-toe");
      setMatches(matches);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const createGame = async () => {
    const { matchID } = await lobbyClient.createMatch("tic-tac-toe", {
      numPlayers: 2,
    });
    const { playerCredentials } = await lobbyClient.joinMatch(
      "tic-tac-toe",
      matchID,
      { playerName: user!.name }
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-end">
        <button onClick={createGame}>create game</button>
      </div>
    </div>
  );
};

export default withProtectedRoute(Lobby);

// const server = "http://localhost:3000/";

// const TicTacToeClient = Client({
//   game: TicTacToe,
//   board: TicTacToeBoard,
//   multiplayer: SocketIO({ server: server }),
//   debug: false,
// });

//   // @ts-ignore:
//   return <TicTacToeClient playerID={playerID} />;

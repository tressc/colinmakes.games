"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { LobbyClient } from "boardgame.io/client";
import { LobbyAPI } from "boardgame.io";
import withProtectedRoute from "@/utils/withProtectedRoute";
import { UserContext } from "@/contexts/userContext";
import { redirect } from "next/navigation";

const Lobby = () => {
  const { user } = useContext(UserContext);

  const [matches, setMatches] = useState<LobbyAPI.Match[] | null>(null);

  const dev = process.env.NODE_ENV !== "production";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = process.env.NEXT_PUBLIC_URL;

  const lobbyClient = useMemo(
    () =>
      new LobbyClient({ server: dev ? apiUrl : url?.slice(0, -1) + ":8000" }),
    []
  );

  useEffect(() => {
    const updateMatches = async () => {
      const { matches } = await lobbyClient.listMatches("tic-tac-toe");
      setMatches(matches);
    };
    // initial page load
    updateMatches();
    // poll for list updated list of matches
    const interval = setInterval(async () => {
      updateMatches();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [lobbyClient]);

  const joinMatch = async (matchID: string) => {
    // join a pending match
    const { playerCredentials, playerID } = await lobbyClient.joinMatch(
      "tic-tac-toe",
      matchID,
      { playerName: user!.name }
    );
    return redirect(
      `match/${matchID}?token=${playerCredentials}&playerID=${playerID}`
    );
  };

  const createAndJoinMatch = async () => {
    // create and join a new match
    const { matchID } = await lobbyClient.createMatch("tic-tac-toe", {
      numPlayers: 2,
    });
    joinMatch(matchID);
  };

  const getMatchesList = () => {
    // display a list of pending matches
    if (!matches) return null;
    return matches.map((match, i) => {
      return (
        <div key={i} className="flex justify-between border border-black">
          <div>{match.matchID}</div>
          <button onClick={() => joinMatch(match.matchID)}>join game</button>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-end">
        <button onClick={createAndJoinMatch}>create game</button>
      </div>
      {getMatchesList()}
    </div>
  );
};

export default withProtectedRoute(Lobby);

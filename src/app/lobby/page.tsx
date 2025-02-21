"use client";

import { useContext, useEffect, useMemo, useState, useCallback } from "react";
import withProtectedRoute from "@/utils/withProtectedRoute";
import { LobbyClient } from "boardgame.io/client";
import { UserContext } from "@/contexts/userContext";
import { redirect, useSearchParams } from "next/navigation";

const Lobby = () => {
  const { user } = useContext(UserContext);
  const searchParams = useSearchParams();

  const [playerCredentials, setPlayerCredentials] = useState<string | null>(
    null,
  );
  const [playerID, setPlayerID] = useState<string | null>(null);
  const [matchID, setMatchID] = useState<string | null>(null);
  const [isMatchCreated, setIsMatchCreated] = useState<boolean>(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const lobbyClient = useMemo(
    () => new LobbyClient({ server: apiUrl }),
    [apiUrl],
  );

  // TODO: use env var for hostname
  const inviteLink = `https://www.colinmakes.games/lobby?matchID=${matchID}`;

  const redirectToMatchIfFull = useCallback(async () => {
    const match = await lobbyClient.getMatch("setto", matchID!);
    if (match.players[1].name) {
      const opponentName = match.players.find(
        (player) => player.id !== parseInt(playerID!),
      )!.name;
      const opponentIcon = match.players.find(
        (player) => player.id !== parseInt(playerID!),
      )!.data.icon;
      return redirect(
        `/match/${matchID}?token=${playerCredentials}&playerID=${playerID}&opponentName=${opponentName}&opponentIcon=${opponentIcon}`,
      );
    }
  }, [lobbyClient, matchID, playerCredentials, playerID]);

  const joinMatch = useCallback(async () => {
    // join a pending match
    const { playerCredentials, playerID } = await lobbyClient.joinMatch(
      "setto",
      matchID!,
      { playerName: user!.name, data: { icon: user!.svg } },
    );
    setPlayerCredentials(playerCredentials);
    setPlayerID(playerID);
  }, [lobbyClient, matchID, user]);

  useEffect(() => {
    // if match is created && joined, poll for match updates
    if (!isMatchCreated || !playerCredentials) {
      return;
    }
    // poll for match updates
    const interval = setInterval(async () => {
      redirectToMatchIfFull();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [isMatchCreated, playerCredentials, redirectToMatchIfFull]);

  useEffect(() => {
    // user has arrived via invite link
    if (searchParams.has("matchID")) {
      setMatchID(searchParams.get("matchID")!);
    }
  }, [searchParams]);

  useEffect(() => {
    // if matchId is set, join the match
    if (matchID && !playerCredentials) {
      joinMatch();
    }
  }, [matchID, playerCredentials, joinMatch]);

  useEffect(() => {
    // user has joined via invite link
    if (playerCredentials && !isMatchCreated) {
      redirectToMatchIfFull();
    }
  }, [playerCredentials, isMatchCreated, redirectToMatchIfFull]);

  const createMatch = async () => {
    // create a new match
    const { matchID } = await lobbyClient.createMatch("setto", {
      numPlayers: 2,
    });
    setMatchID(matchID);
    setIsMatchCreated(true);
  };

  const copyInvite = () => {
    navigator.clipboard.writeText(inviteLink);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      {isMatchCreated ? (
        <div className="flex flex-col items-center">
          <div className="text-white">
            Send your friend the invite link below
          </div>
          <div className="align-center mt-4 flex items-center">
            <div className="mr-1 rounded-md border border-white bg-white bg-opacity-20 p-2 text-white">
              {inviteLink}
            </div>
            <button
              onClick={copyInvite}
              className="rounded-md border border-black bg-white p-2 text-black"
            >
              copy
            </button>
          </div>
          <div className="mt-4 text-white">
            Waiting for opponent. Your match will begin once they join!
          </div>
        </div>
      ) : (
        <button
          onClick={createMatch}
          className="rounded-md border border-black bg-white p-2 text-black"
          disabled={matchID !== null}
        >
          create game
        </button>
      )}
    </div>
  );
};

export default withProtectedRoute(Lobby);

"use client";

import { useContext, useEffect, useMemo, useState, useCallback } from "react";
import withProtectedRoute from "@/utils/withProtectedRoute";
import { LobbyClient } from "boardgame.io/client";
import { UserContext } from "@/contexts/userContext";
import { LanguageContext } from "@/contexts/languageContext";
import { redirect, useSearchParams } from "next/navigation";

const Lobby = () => {
  const { user } = useContext(UserContext);
  const { language, languageOptions } = useContext(LanguageContext);
  const searchParams = useSearchParams();

  const [playerCredentials, setPlayerCredentials] = useState<string | null>(
    null,
  );
  const [playerID, setPlayerID] = useState<string | null>(null);
  const [matchID, setMatchID] = useState<string | null>(null);
  const [isMatchCreated, setIsMatchCreated] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string | null>(null);

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
    // TODO: handle error if matchID is invalid, surface to user
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

  const renderCreated = () => {
    return (
      <div className="flex flex-col items-center">
        <div>
          {language === languageOptions.english
            ? "Match created! Your join code is:"
            : "作りました！参加コードは："}
        </div>
        <div className="m-2 text-3xl">{matchID}</div>
        <div>
          {language === languageOptions.english
            ? "Send your friend the invite link below"
            : "友達に下のリンクを送ってください"}
        </div>
        <div className="align-center mt-4 flex items-center">
          <div className="mr-1 rounded-md border border-white bg-white bg-opacity-20 p-2 text-white">
            {inviteLink}
          </div>
          <button
            onClick={copyInvite}
            className="rounded-md border border-black bg-white p-2 text-black"
          >
            {language === languageOptions.english ? "copy" : "コピー"}
          </button>
        </div>
        <div className="mt-4">
          {language === languageOptions.english
            ? "Waiting for opponent. Your match will begin once they join!"
            : "相手を待っています。相手が参加するとゲームが開始します！"}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen items-center justify-center text-white">
      {isMatchCreated ? (
        renderCreated()
      ) : (
        <div className="flex flex-col items-center">
          <div className="mb-2 text-4xl">
            {language === languageOptions.english
              ? "join existing game"
              : "存在するゲームに参加"}
          </div>
          <div className="flex items-center">
            <input
              className="rounded-md border border-black bg-white p-2 text-black"
              placeholder={
                language === languageOptions.english
                  ? "join code"
                  : "参加コード"
              }
              value={inputText || ""}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              onClick={() => setMatchID(inputText)}
              className="rounded-md border border-black bg-white p-2 text-black hover:text-blue-500"
            >
              {language === languageOptions.english ? "join" : "参加する"}
            </button>
          </div>
          <div className="m-6 text-xl">
            {language === languageOptions.english ? "or" : "か"}
          </div>

          <div className="mb-2 text-4xl">
            {language === languageOptions.english
              ? "create new game"
              : "新しいゲームを作る"}
          </div>
          <button
            onClick={createMatch}
            className="rounded-md border border-black bg-white p-2 text-black hover:text-blue-500"
            disabled={matchID !== null}
          >
            {language === languageOptions.english ? "create" : "作る"}
          </button>
        </div>
      )}
    </div>
  );
};

export default withProtectedRoute(Lobby);

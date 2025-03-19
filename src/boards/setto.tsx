"use client";

import React, { useContext, useEffect, useState } from "react";
import type { BoardProps } from "boardgame.io/react";
import localFont from "next/font/local";
import { useSearchParams } from "next/navigation";
import { UserContext } from "@/contexts/userContext";
import { LanguageContext } from "@/contexts/languageContext";
import Image from "next/image";
import { Popover } from "@base-ui-components/react/popover";
import Help from "@mui/icons-material/Help";
import grey from "@mui/material/colors/grey";

const dicier = localFont({
  src: "../../public/fonts/Dicier-Round-Light.woff2",
  variable: "--font-dicier",
  display: "swap",
});
const dicierDark = localFont({
  src: "../../public/fonts/Dicier-Round-Dark.woff2",
  variable: "--font-dicier-dark",
  display: "swap",
});

interface Mapping {
  suitCode: string;
  fontColor: string;
  bgColor: string;
  bgImage: string;
  border: string;
}

interface SuitMap {
  [key: string]: Mapping;
}

const suitMap: SuitMap = {
  a: {
    suitCode: "SPRING",
    fontColor: "text-[#006400]",
    bgColor: "bg-[#b0e57c]",
    bgImage: "bg-[url(/img/yagasuri.jpg)]",
    border: "border-[#006400]",
  },
  b: {
    suitCode: "SUMMER",
    fontColor: "text-[#8b0000]",
    bgColor: "bg-[#ff9a9a]",
    bgImage: "bg-[url(/img/ichimatsu.jpg)]",
    border: "border-[#8b0000]",
  },
  c: {
    suitCode: "ACORNS",
    fontColor: "text-[#b35900]",
    bgColor: "bg-[#ffd27f]",
    bgImage: "bg-[url(/img/asanoha.jpg)]",
    border: "border-[#b35900]",
  },
  d: {
    suitCode: "WINTER",
    fontColor: "text-[#00008b]",
    bgColor: "bg-[#aec6cf]",
    bgImage: "bg-[url(/img/seigaiha.jpg)]",
    border: "border-[#00008b]",
  },
};

function ArrowSvg(props: React.ComponentProps<"svg">) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className="fill-black"
      />
      <path
        d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
        className="fill-gray-200"
      />
    </svg>
  );
}

const currentTurnArrow = (
  <div className="ml-1 -scale-x-75 scale-y-150 text-xl text-white">
    &#10148;
  </div>
);

const Explainer = () => {
  // base-ui popover displaying "how to play"
  const { languageOptions, language } = useContext(LanguageContext);
  return (
    <Popover.Root>
      <Popover.Trigger className="mr-5">
        <Help
          fontSize="large"
          sx={{
            "&:hover": { color: grey[200] },
            color: "white",
            fontSize: 40,
          }}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Backdrop />
        <Popover.Positioner side="left">
          <Popover.Popup className="h-160 mr-3 mt-9 w-64 border border-white bg-black bg-opacity-80 p-3 text-white md:h-80 md:w-96">
            <Popover.Arrow className="-right-[.10rem] rotate-90">
              <ArrowSvg />
            </Popover.Arrow>
            <Popover.Title className="text-2xl font-bold">
              {language === languageOptions.english
                ? "How To Play"
                : "遊び方の説明書"}
            </Popover.Title>
            <Popover.Description className="mt-4">
              {language === languageOptions.english
                ? "Players alternate turns replacing a card in the grid with their mark. On their turn, players must choose a card which matches either the suit or the value of the card last chosen by their opponent (on the first turn, any card can be chosen)."
                : "プレーヤ達は順番に一枚の札を取って、その場所に自分のマーク（❌か⭕️）を置きます。相手が選んだ札の同じ色か数字の札を選ばなければいけません。最初のターンで、どの札も選べます。"}
              <br className="m-3 block content-['']" />
              {language === languageOptions.english
                ? "The first player to place four of their marks in a line (horizontally, vertically, or diagonally) or in a square, is the winner. Alternatively, a player loses if there are no legal moves on their turn."
                : "勝者は列（平行、縦、斜め）か四角で四つのマークを置く遊びです。それか、もし選ぶことが出来る札がなければ、敗者になります。"}
            </Popover.Description>
            <Popover.Close />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};

const SettoBoard = (props: BoardProps) => {
  const { G, ctx, moves } = props;
  const searchParams = useSearchParams();
  const playerID = searchParams.get("playerID");
  const { user } = useContext(UserContext);

  const [userName, setUserName] = useState<string | null>(null);
  const [userIcon, setUserIcon] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    setUserName(user!.name);
    setUserIcon(user!.svg);
  }, [user]);

  const onClick = (id: string) => moves.clickGridPos(id);

  const renderWinnerText = () => {
    if (!ctx.gameover) return null;

    return (
      <div className="ml-1 p-1 text-[30px] text-white" id="winner">
        {(ctx.gameover.winner === playerID
          ? userName
          : searchParams.get("opponentName")) + " wins!"}
      </div>
    );
  };

  const isValidMove = (id: string) => {
    // if previous card is null, all cards are legal
    if (G.previousCard === null) return true;
    const suit = G.previousCard[0];
    const value = G.previousCard[1];
    // if the previous card matches this card's suit or value, it is legal
    if (
      G.connections[suit].includes(parseInt(id)) ||
      G.connections[value].includes(parseInt(id))
    ) {
      return true;
    }
    return false;
  };

  const renderCard = (
    card: string,
    isLegal: boolean,
    isPreviousCard = false,
  ) => {
    // only for previous card at game start
    if (!card) {
      return null;
    }
    // if card replaced by player token
    if (card.length !== 2) {
      return (
        <div
          className={`h-[50px] text-center leading-[30px] md:h-[100px] md:leading-[70px] ${card === "0" ? dicier.className : dicierDark.className} m-[8px] text-[70px] text-white md:text-[100px]`}
        >
          {card === "0" ? "CIRCLE" : "CROSS"}
        </div>
      );
    }
    const mapping: Mapping = suitMap[card[0]];
    const legal = "transition-transform ease-out hover:scale-110";
    const illegal = "opacity-50";
    let conditionalStyles = "";
    if (!isPreviousCard) {
      conditionalStyles = isLegal ? legal : illegal;
    }

    return (
      <div
        className={`${conditionalStyles} flex-column flex content-between text-[20px] leading-none bg-blend-soft-light md:text-[30px] ${dicierDark.className} m-[8px] grid size-16 rounded-md border border-[2px] border-solid p-2 md:size-24 md:p-3 ${mapping.border} ${mapping.bgImage} ${mapping.bgColor} ${mapping.fontColor}`}
      >
        <div className="flex justify-end">{mapping.suitCode}</div>
        <div className="flex justify-start text-[20px] md:text-[40px]">
          {card[1]}
        </div>
      </div>
    );
  };

  const renderGrid = () => {
    const grid = [];
    for (let i = 0; i < 4; i++) {
      const row = [];
      for (let j = 0; j < 4; j++) {
        const id = String(4 * i + j);
        const isLegal = isValidMove(id);
        row.push(
          <td key={id}>
            {G.grid[id].length === 1 ? (
              renderCard(G.grid[id], isLegal)
            ) : (
              <button onClick={() => onClick(id)} disabled={!isLegal}>
                {renderCard(G.grid[id], isLegal)}
              </button>
            )}
          </td>,
        );
      }
      grid.push(<tr key={i}>{row}</tr>);
    }
    return grid;
  };

  const renderPlayerCard = (
    playerID: string,
    playerName: string,
    playerIcon?: string,
  ) => {
    if (!playerIcon) {
      return null;
    }
    return (
      <div className="flex flex-row items-center">
        <div
          className={`m-1 flex w-48 items-center justify-start rounded-md border border-white bg-white bg-opacity-20 p-1`}
        >
          <Image
            width={1}
            height={1}
            alt="player icon"
            className="mr-2 size-12"
            src={"data:image/svg+xml;base64," + playerIcon}
          />
          <div className="flex flex-col">
            <div className="text-white">{playerName}</div>
            <div
              className={`text-white ${playerID === "0" ? dicier.className : dicierDark.className}`}
            >
              {playerID === "0" ? "CIRCLE" : "CROSS"}
            </div>
          </div>
        </div>
        {ctx.currentPlayer === playerID ? currentTurnArrow : null}
        {ctx.gameover?.winner === playerID ? renderWinnerText() : null}
      </div>
    );
  };

  return (
    <div className="mt-3 flex h-svh w-svw flex-col items-center justify-center">
      <div className="flex w-full">
        <div className="flex w-full flex-col items-start">
          {renderPlayerCard(playerID!, userName!, userIcon!)}
          {renderPlayerCard(
            playerID === "0" ? "1" : "0",
            searchParams.get("opponentName")!,
            searchParams.get("opponentIcon")?.replaceAll(" ", "+"),
          )}
        </div>
        <Explainer />
      </div>
      <table id="board" className="mb-8">
        <tbody>{renderGrid()}</tbody>
      </table>
      <div className="padding-[10px] mr-8 box-border flex size-24 items-center justify-center rounded-md border border-[4px] border-dotted border-white p-3 md:size-32">
        <div>{renderCard(G.previousCard, true, true)}</div>
      </div>
    </div>
  );
};

export { SettoBoard };

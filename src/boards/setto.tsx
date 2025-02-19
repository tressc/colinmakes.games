"use client";

import React from "react";
import type { BoardProps } from "boardgame.io/react";
import localFont from "next/font/local";

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

export type Card = string | null;

export interface Mapping {
  suitCode: string;
  fontColor: string;
  bgColor: string;
  bgImage: string;
  border: string;
}

export interface SuitMap {
  [key: string]: Mapping;
}

const suitMap: {
  [key: string]: Mapping;
} = {
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

const SettoBoard = (props: BoardProps) => {
  // const boundingRef = useRef<DOMRect | null>(null);
  const { G, ctx, moves } = props;

  console.log(ctx);

  const onClick = (id: string) => moves.clickGridPos(id);
  let winner = null;

  if (ctx.gameover) {
    winner = (
      <div className="text-[30px] text-white" id="winner">
        Winner: {ctx.gameover.winner}
      </div>
    );
  }

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
    if (isPreviousCard) {
      conditionalStyles = "";
    } else {
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

  const tbody = [];
  for (let i = 0; i < 4; i++) {
    const grid = [];
    for (let j = 0; j < 4; j++) {
      const id = String(4 * i + j);
      const isLegal = isValidMove(id);
      grid.push(
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
    tbody.push(<tr key={i}>{grid}</tr>);
  }

  return (
    <div className="flex h-svh w-svw flex-col items-center justify-center">
      <table id="board" className="mb-8">
        <tbody>{tbody}</tbody>
      </table>
      <div className="padding-[10px] mr-8 box-border flex size-24 items-center justify-center rounded-md border border-[4px] border-dotted border-white p-3 md:size-32">
        <div>{renderCard(G.previousCard, true, true)}</div>
      </div>
      {winner}
    </div>
  );
};

export { SettoBoard };

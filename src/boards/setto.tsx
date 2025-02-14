"use client";

import React, { useRef } from "react";
import type { BoardProps } from "boardgame.io/react";

export type Card = string | null;

export interface Mapping {
  suitCode: string;
  fontColor: string;
  bgColor: string;
  bgImage: string;
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
  },
  b: {
    suitCode: "SUMMER",
    fontColor: "text-[#8b0000]",
    bgColor: "bg-[#ff9a9a]",
    bgImage: "bg-[url(/img/ichimatsu.jpg)]",
  },
  c: {
    suitCode: "ACORNS",
    fontColor: "text-[#b35900]",
    bgColor: "bg-[#ffd27f]",
    bgImage: "bg-[url(/img/asanoha.jpg)]",
  },
  d: {
    suitCode: "WINTER",
    fontColor: "text-[#00008b]",
    bgColor: "bg-[#aec6cf]",
    bgImage: "bg-[url(/img/seigaiha.jpg)]",
  },
};

const SettoBoard = (props: BoardProps) => {
  const boundingRef = useRef<DOMRect | null>(null);
  const { G, ctx, moves } = props;

  const onClick = (id: string) => moves.clickGridPos(id);
  let winner;

  if (ctx.gameover) {
    winner = <div id="winner">Winner: {ctx.gameover.winner}</div>;
  }

  const renderCard = (card: string) => {
    // only for previous card at game start
    if (!card) {
      return null;
    }
    // if card replaced by player token
    if (card.length !== 2) {
      return (
        <div className="text-center h-[100px] leading-[70px] font-[Dicier] text-[100px] text-white">
          {card === "0" ? "CIRCLE" : "CROSS"}
        </div>
      );
    }
    const mapping: Mapping = suitMap[card[0]];
    return (
      <div className="[perspective:800px]">
        <div
          onMouseLeave={() => (boundingRef.current = null)}
          onMouseEnter={(ev) => {
            boundingRef.current = ev.currentTarget.getBoundingClientRect();
          }}
          onMouseMove={(ev) => {
            if (!boundingRef.current) return;
            const x = ev.clientX - boundingRef.current.left;
            const y = ev.clientY - boundingRef.current.top;
            const xPercentage = x / boundingRef.current.width;
            const yPercentage = y / boundingRef.current.height;
            const xRotation = (xPercentage - 0.5) * 20;
            const yRotation = (0.5 - yPercentage) * 20;

            ev.currentTarget.style.setProperty(
              "--x-rotation",
              `${yRotation}deg`
            );
            ev.currentTarget.style.setProperty(
              "--y-rotation",
              `${xRotation}deg`
            );
            ev.currentTarget.style.setProperty("--x", `${xPercentage * 100}%`);
            ev.currentTarget.style.setProperty("--y", `${yPercentage * 100}%`);
          }}
          className={`bg-blend-soft-light leading-none text-[30px] flex flex-column content-between font-[Dicier-dark] p-3 m-[8px] size-[100px] group relative grid rounded-md ${mapping.bgImage} ${mapping.bgColor} ${mapping.fontColor} transition-transform ease-out hover:[transform:rotateX(var(--x-rotation))_rotateY(var(--y-rotation))_scale(1.1)]`}
        >
          <div className="flex justify-end">{mapping.suitCode}</div>
          <div className="flex justify-start text-[40px]">{card[1]}</div>
        </div>
      </div>
    );
  };

  const tbody = [];
  for (let i = 0; i < 4; i++) {
    const grid = [];
    for (let j = 0; j < 4; j++) {
      const id = String(4 * i + j);
      grid.push(
        <td key={id}>
          {G.grid[id].length === 1 ? (
            renderCard(G.grid[id])
          ) : (
            <button onClick={() => onClick(id)}>
              {renderCard(G.grid[id])}
            </button>
          )}
        </td>
      );
    }
    tbody.push(<tr key={i}>{grid}</tr>);
  }

  return (
    <div className="flex flex-column items-center justify-center w-svw h-svh bg-cover bg-[#301934] bg-[url(/img/paper.jpg)] bg-blend-multiply">
      <div className="flex">
        <div className="h-full flex justify-start items-start w-[124px] h-[124px] mr-8 padding-[10px] border border-white rounded-md border-[4px] box-border">
          <div>{renderCard(G.previousCard)}</div>
        </div>
        <table id="board" className="mb-8">
          <tbody>{tbody}</tbody>
        </table>
      </div>
    </div>
  );
};

export { SettoBoard };

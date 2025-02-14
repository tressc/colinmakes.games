"use client";

import React from "react";
import type { BoardProps } from "boardgame.io/react";

export function SettoBoard(props: BoardProps) {
  const { G, ctx, moves } = props;
  const onClick = (id: string) => moves.clickGridPos(id);
  let winner;

  if (ctx.gameover) {
    winner = <div id="winner">Winner: {ctx.gameover.winner}</div>;
  }

  const tbody = [];
  for (let i = 0; i < 4; i++) {
    const grid = [];
    for (let j = 0; j < 4; j++) {
      const id = String(4 * i + j);
      grid.push(
        <td key={id}>
          {G.grid[id].length === 1 ? (
            <div className="border border-black lg:leading-10 md:leading-10 sm:leading-10 text-center w-10 h-10">
              {G.grid[id]}
            </div>
          ) : (
            <button
              className="border border-black w-10 h-10"
              onClick={() => onClick(id)}
            >
              {G.grid[id]}
            </button>
          )}
        </td>
      );
    }
    tbody.push(<tr key={i}>{grid}</tr>);
  }

  return (
    <div>
      <table id="board" className="mb-8">
        <tbody>{tbody}</tbody>
      </table>
      <div className="border border-black lg:leading-10 md:leading-10 sm:leading-10 text-center w-10 h-10">
        {G.previousCard}
      </div>
      {winner}
    </div>
  );
}

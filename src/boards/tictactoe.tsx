"use client";

import React from "react";
import type { BoardProps } from "boardgame.io/react";
// import type { MyGameState } from "../games/tictactoe";

export function TicTacToeBoard(props: BoardProps) {
  const { G, ctx, moves } = props;
  const onClick = (id: string) => moves.clickCell(id);
  let winner;

  if (ctx.gameover) {
    winner =
      ctx.gameover.winner !== undefined ? (
        <div id="winner">Winner: {ctx.gameover.winner}</div>
      ) : (
        <div id="winner">Draw!</div>
      );
  }

  const tbody = [];
  for (let i = 0; i < 3; i++) {
    const cells = [];
    for (let j = 0; j < 3; j++) {
      const id = String(3 * i + j);
      cells.push(
        <td key={id}>
          {G.cells[id] ? (
            <div className="border border-black lg:leading-10 md:leading-10 sm:leading-10 text-center w-10 h-10">
              {G.cells[id]}
            </div>
          ) : (
            <button
              className="border border-black w-10 h-10"
              onClick={() => onClick(id)}
            />
          )}
        </td>
      );
    }
    tbody.push(<tr key={i}>{cells}</tr>);
  }

  return (
    <div>
      <table id="board" className="mb-8">
        <tbody>{tbody}</tbody>
      </table>
      {winner}
    </div>
  );
}

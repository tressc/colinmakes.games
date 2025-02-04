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

  // const cellStyle = {
  //   border: "1px solid #555",
  //   width: "50px",
  //   height: "50px",
  //   lineHeight: "50px",
  //   textAlign: "center",
  // };

  let tbody = [];
  for (let i = 0; i < 3; i++) {
    let cells = [];
    for (let j = 0; j < 3; j++) {
      const id = String(3 * i + j);
      cells.push(
        <td key={id} className="lg:leading-[0px]">
          {G.cells[id] ? (
            <div className="border border-black lg:leading-10 text-center w-10 h-10">
              {G.cells[id]}
            </div>
          ) : (
            <button
              className="border border-black lg:leading-10 text-center w-10 h-10"
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
      <table id="board">
        <tbody>{tbody}</tbody>
      </table>
      {winner}
    </div>
  );
}

"use client";

import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { TicTacToe } from "../games/tictactoe";
import { TicTacToeBoard } from "./board";

const server = "http://localhost:3000/";

const App = Client({
  game: TicTacToe,
  board: TicTacToeBoard,
  multiplayer: SocketIO({ server: server }),
});

export default App;

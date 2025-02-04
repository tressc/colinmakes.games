"use client";

import { Client } from "boardgame.io/react";
import { TicTacToe } from "../games/tictactoe";
import { TicTacToeBoard } from "./board";

const App = Client({ game: TicTacToe, board: TicTacToeBoard });

export default App;

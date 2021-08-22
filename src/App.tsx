import * as React from "react";
import TicTacToe from "./TicTacToe";
import MemoryGame from './MemoryGame';

const App = () => {
  return (
    <div className="App">
      <MemoryGame />
      <TicTacToe />
    </div>
  );
};

export default App;

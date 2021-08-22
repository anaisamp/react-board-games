
import * as React from "react";

type BoardGrid = string[][];
type Turn = "X" | "0";

type IAppState = {
  grid: BoardGrid;
  turn: Turn;
  status: "inProgress" | "success";
};

const generateGrid = (rows: number, columns: number, mapper: () => string) => {
  return Array(rows)
    .fill(undefined)
    .map(() => {
      return Array(columns).fill(undefined).map(mapper);
    });
};

const generateTicTacToeGrid = () => generateGrid(3, 3, () => "");

const nextTurn = (turn: Turn) => {
  return turn === "X" ? "O" : "X";
};

const checkForThree = (a: string, b: string, c: string) => {
  if (!a || !b || !c) return false;
  if (a === b && b === c) return true;
  return false;
};

const checkForWin = (grid: string[]) => {
  const [nw, n, ne, w, c, e, sw, s, se] = grid;

  return (
    checkForThree(nw, n, nw) ||
    checkForThree(w, c, e) ||
    checkForThree(sw, s, se) ||
    checkForThree(nw, w, sw) ||
    checkForThree(w, c, e) ||
    checkForThree(sw, s, se) ||
    checkForThree(nw, c, se) ||
    checkForThree(ne, c, sw)
  );
};

const checkForDraw = (grid: string[]) => {
  //same as grid.filter(Boolean).length === grid.length;
  return grid.filter((t) => t).length === grid.length;
};

// const initialState: IAppState = {
//   grid: generateTicTacToeGrid(),
//   turn: "X",
// };
// transforming initialState into a function to avoid passing the same reference of initial state.
// usefull when we have a game that uses some randomness to generate the board.
const getInitialState: () => IAppState = () => ({
  grid: generateTicTacToeGrid(),
  turn: "X",
  status: "inProgress",
});

const clone = (obj: any) => JSON.parse(JSON.stringify(obj)); // deeply copy

const reducer = (state: IAppState, action: any) => {
  if (state.status === "success" && action.type !== "RESET") {
    return state;
  }
  switch (action.type) {
    case "RESET": {
      return getInitialState();
    }
    case "CLICK": {
      const { x, y } = action.payload;
      const { grid, turn } = state;

      if (grid[y][x]) {
        // it's an 'O' or 'X' already
        return state;
      }

      const newState = clone(state);
      newState.grid[y][x] = turn;

      //check for win
      const flatternedGrid = newState.grid.flat();

      if (checkForWin(flatternedGrid)) {
        newState.status = "success";
        return newState;
      }

      //check for draw - restart the game
      if (checkForDraw(flatternedGrid)) {
        return getInitialState();
      }

      newState.turn = nextTurn(turn);

      return newState;
    }
    default:
      return state;
  }
};

const TicTacToe = () => {
  // const grid = generateTicTacToeGrid();
  // replaced by state
  const [state, dispatch] = React.useReducer(reducer, getInitialState());

  const { grid, turn, status } = state;

  const handleCellClick = (xIndex: number, yIndex: number) =>
    dispatch({ type: "CLICK", payload: { x: xIndex, y: yIndex } });

  const handleReset = () => dispatch({ type: "RESET" });

  return (
    <div style={{marginTop: 50}}>
      <div>{status === "inProgress" ? `Next turn: ${turn}` : null}</div>
      <div>{status === "success" ? `${turn} won!` : null}</div>
      <button style={{ display: "block" }} type="button" onClick={handleReset}>
        Reset
      </button>
      <Grid grid={grid} handleCellClick={handleCellClick} />
    </div>
  );
};

const Grid: React.FC<{ grid: BoardGrid; handleCellClick: any }> = ({
  grid,
  handleCellClick,
}) => {
  return (
    <div style={{ display: "inline-block" }}>
      <div
        style={{
          backgroundColor: "#444",
          display: "grid",
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
          gridGap: 1,
        }}
      >
        {grid.map((y, yIndex) =>
          y.map((x, xIndex) => (
            <Cell
              key={`${xIndex}-${yIndex}`}
              value={x}
              handleCellClick={() => handleCellClick(xIndex, yIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
};

const Cell: React.FC<{ value: string; handleCellClick: any }> = ({
  value,
  handleCellClick,
}) => {
  return (
    <div style={{ backgroundColor: "#fff", width: 100, height: 100 }}>
      <button
        type="button"
        style={{ width: "100%", height: "100%" }}
        onClick={handleCellClick}
      >
        {value}
      </button>
    </div>
  );
};

export default TicTacToe;

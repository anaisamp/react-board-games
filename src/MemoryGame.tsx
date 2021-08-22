//// import './types.d.ts';
import * as React from "react";
import randomEmoji from "random-unicode-emoji";

// Spec
// - shows sets of emojis as cards
// - in random order
// - gameplay
// -- You may click to reveal one
// -- You may clicking to a second one: if it matches both stay visible; if not, both go back to hidden
// - revealing all shows success message
// - click on success message to restart
// - allow user to set their own amount of cards

const N_CARDS = 4;

type Emoji = string;

const shuffleArray = (array: []) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

const generateGame = (n_cards: number) => {
  const emojis = randomEmoji.random({ count: n_cards });
  const doubleEmojis = emojis
    .map((character: any) => [character, character])
    .flat();
  return shuffleArray(doubleEmojis);
};

const Board: React.FC<{
  shownCards: Emoji[];
  handleClick: any;
}> = ({ shownCards, handleClick }) => {
  return (
    <div style={{ display: "flex" }}>
      {shownCards.map((card: Emoji, i: number) => (
        <Card key={i} handleClick={() => handleClick(i)} value={card} />
      ))}
    </div>
  );
};

const Card: React.FC<{ value: Emoji; handleClick: any }> = ({
  value,
  handleClick,
}) => {
  return (
    <div style={{ marginRight: "4px", width: 50, height: 50 }}>
      <button
        type="button"
        style={{ width: "100%", height: "100%" }}
        onClick={handleClick}
      >
        {value}
      </button>
    </div>
  );
};

const checkIfMatch = (a: Emoji, b: Emoji) => a && b && a === b;

const MemoryGame = () => {
  const [cards, setCards] = React.useState(generateGame(N_CARDS));
  const [shownCards, setShownCards] = React.useState(
    Array(N_CARDS * 2).fill("")
  );
  const [latest, setLatest] = React.useState(-1);

  const handleClick = (i: number) => {
    // show clicked card (if not showed yet)
    // check latest card showed
    // - check if there is a match
    // -- is a match  -> keep revealed
    // -- not a match -> hide both
    // - keep state + set current card index as latest

    // if card not showed yet

    if (!shownCards[i]) {
      // show card
      const shownCardsCopy = JSON.parse(JSON.stringify(shownCards));
      shownCardsCopy[i] = cards[i];
      setShownCards(shownCardsCopy);

      // setTimeout prevents unmatched card to be hidden too quickly
      setTimeout(() => {
        if (latest !== -1) {
          console.log("here", latest);
          if (!checkIfMatch(cards[i], cards[latest])) {
            // hide both cards
            const shownCardsCopy = JSON.parse(JSON.stringify(shownCards));
            shownCardsCopy[i] = "";
            shownCardsCopy[latest] = "";
            setShownCards(shownCardsCopy);
          }
          setLatest(-1);
        } else {
          setLatest(i);
        }
      }, 300);
    }
  };

  const resetGame = () => {
    setCards(generateGame(N_CARDS));
    setShownCards(Array(N_CARDS * 2).fill(""));
    setLatest(-1);
  };

  return (
    <div>
      <Board shownCards={shownCards} handleClick={handleClick} />
      {shownCards.filter(Boolean).length === cards.length ? (
        <button
          onClick={resetGame}
          style={{ background: "#fff", border: "none", color: "green" }}
        >
          Whooo! You won! Click to play again.
        </button>
      ) : null}
    </div>
  );
};

export default MemoryGame;

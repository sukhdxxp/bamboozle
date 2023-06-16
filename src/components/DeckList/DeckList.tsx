import { DeckListType } from "../DeckCard/Deck.types";
import DeckCard from "../DeckCard";
import styles from "./DeckList.module.css";
import Link from "next/link";

type DeckListProps = {
  decks: DeckListType;
};

export default function DeckList({ decks }: DeckListProps) {
  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Decks
      </h1>
      <div className={styles.deckListWrapper}>
        {decks.map((deck) => {
          return (
            <Link
              className={styles.deckListItem}
              key={deck.id}
              href={`/decks/${deck.id}`}
            >
              <DeckCard deck={deck} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

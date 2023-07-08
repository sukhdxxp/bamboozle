import DeckCard from "../DeckCard";
import Link from "next/link";
import { DeckType } from "@/models/Deck.model";

type DeckListProps = {
  decks: DeckType[];
};

export default function DeckList({ decks }: DeckListProps) {
  return (
    <div className="px-4 my-4">
      <h1 className="text-xl">Choose a deck</h1>
      <div className="mt-2">
        {decks.map((deck) => {
          return (
            <Link
              className="cursor-pointer mt-2 block"
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

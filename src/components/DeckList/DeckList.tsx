import DeckCard from "../DeckCard";
import { DeckType } from "@/models/Deck.model";

type DeckListProps = {
  decks: DeckType[];
};

export default function DeckList({ decks }: DeckListProps) {
  return (
    <div className="my-8">
      <h1 className="px-4 text-xl">Choose a deck</h1>
      <div className="w-full overflow-x-scroll">
        <div className="flex py-4 px-2">
          {decks.map((deck) => {
            return <DeckCard deck={deck} key={deck.id} />;
          })}
        </div>
      </div>
    </div>
  );
}

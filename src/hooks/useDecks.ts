import { useEffect, useState } from "react";
import { DeckType } from "@/models/Deck.model";
import { useList, useObject } from "react-firebase-hooks/database";
import { firebaseDB, ref } from "@/lib/data/firebase";

export const useDecks = () => {
  const [decks, setDecks] = useState<DeckType[]>([]);
  const [snapshots, loading, error] = useList(ref(firebaseDB, "decks"));

  useEffect(() => {
    if (snapshots) {
      const deckData = snapshots.map((v) => {
        return {
          id: v.key,
          ...v.val(),
        };
      }) as DeckType[];
      setDecks(deckData);
    }
  }, [snapshots]);

  return [decks, loading, error] as [DeckType[], boolean, Error];
};

export const useDeck = (id: string) => {
  const [deck, setDeck] = useState<DeckType | null>(null);
  const [object, loading, error] = useObject(ref(firebaseDB, `decks/${id}`));

  useEffect(() => {
    if (object) {
      const deckData = object.val() as DeckType;
      setDeck(deckData);
    }
  }, [object]);

  return [deck, loading, error] as [DeckType | null, boolean, Error];
};

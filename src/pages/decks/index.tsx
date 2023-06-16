"use client";
import { useList } from "react-firebase-hooks/database";
import { firebaseDB, ref } from "../../lib/data/firebase";

import DeckList from "../../components/DeckList/DeckList";
import { DeckListType } from "../../components/DeckCard/Deck.types";
import Head from "next/head";

function DeckPage() {
  const [snapshots, loading, error] = useList(ref(firebaseDB, "decks"));
  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error: {error.toString()}</div>;
  } else if (!snapshots || snapshots.length === 0) {
    return <div>No Data Found</div>;
  }

  const decks = snapshots.map((v) => {
    return {
      id: v.key,
      ...v.val(),
    };
  }) as unknown as DeckListType;

  return (
    <div>
      <Head>
        <title>DeckPage</title>
      </Head>
      <DeckList decks={decks} />
    </div>
  );
}

export default DeckPage;

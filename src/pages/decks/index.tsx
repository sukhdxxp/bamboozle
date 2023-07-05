"use client";

import DeckList from "../../components/DeckList/DeckList";
import Head from "next/head";
import { useDecks } from "@/hooks/useDecks";

function DeckPage() {
  const [decks, loading, error] = useDecks();
  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error: {error.toString()}</div>;
  } else if (!decks || decks.length === 0) {
    return <div>No Data Found</div>;
  }

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

"use client";

import DeckList from "../components/DeckList/DeckList";
import Head from "next/head";
import { useDecks } from "@/hooks/useDecks";
import Header from "@/components/Header";

function HomePage() {
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
        <title>Bamboozle - Home</title>
      </Head>
      <Header />
      <DeckList decks={decks} />
    </div>
  );
}

export default HomePage;

"use client";

import Head from "next/head";
import { useRouter } from "next/router";
import DeckIcon from "../../../components/DeckIcon";
import axios from "../../../utils/axios";
import { useDeck } from "@/hooks/useDecks";
import Button from "@/components/Button";

export default function DeckPage() {
  const router = useRouter();
  const deckID = router.query.id as string;

  const [deck, loading, error] = useDeck(deckID);
  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error: {error.toString()}</div>;
  } else if (!deck) {
    return <div>No Data Found</div>;
  }

  const handleButtonClick = async () => {
    const response = await axios.post("/api/rooms", {
      currentDeckID: deckID,
      title: `Room for ${deck.title}`,
    });
    if (response && response.status === 200 && response?.data?.id) {
      await router.push(`/rooms/${response.data.id}`);
    }
  };

  return (
    <div className="flex content-center flex-col justify-center flex-wrap">
      <Head>
        <title>DeckPage</title>
      </Head>
      <div>
        <DeckIcon id={deckID} className="w-64 h-64 mb-16" />
      </div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
        {deck.title}
      </h1>
      <h2 className="mt-8 mb-4 font-light text-xl">{deck.description}</h2>
      <Button onClick={handleButtonClick}>Create Room</Button>
    </div>
  );
}

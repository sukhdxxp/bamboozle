"use client";

import Head from "next/head";
import { useObject } from "react-firebase-hooks/database";
import { firebaseDB, ref } from "../../../lib/data/firebase";
import { useRouter } from "next/router";
import { DeckType } from "../../../components/DeckCard/Deck.types";
import DeckIcon from "../../../components/DeckIcon";
import axios from "../../../utils/axios";

export default function DeckPage() {
  const router = useRouter();
  const deckID = router.query.id as string;

  const [object, loading, error] = useObject(
    ref(firebaseDB, `decks/${deckID}`)
  );
  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error: {error.toString()}</div>;
  } else if (!object) {
    return <div>No Data Found</div>;
  }
  const deck = object.val() as DeckType;

  const handleButtonClick = async () => {
    const response = await axios.post("/api/rooms", {
      currentDeckID: deckID,
      title: `Room for ${deck.title}`,
    });
    if( response && response.status === 200 && response?.data?.id) {
      router.push(`/rooms/${response.data.id}`);
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
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        {deck.title}
      </h1>
      <h2 className="mt-8 mb-4 font-light text-xl dark:text-white">
        {deck.description}
      </h2>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-16"
        onClick={handleButtonClick}
      >
        Create Room
      </button>
    </div>
  );
}
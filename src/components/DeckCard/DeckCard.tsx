import { DeckType } from "@/models/Deck.model";
import Button from "@/components/Button";
import { getDeckUiConfig } from "@/components/DeckCard/utils";
import React from "react";
import axios from "@/utils/axios";
import { useRouter } from "next/router";

type DeckCardProps = {
  deck: DeckType;
};
export default function DeckCard({ deck: { id, title } }: DeckCardProps) {
  const uiConfig = getDeckUiConfig(id);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleButtonClick = async () => {
    setIsLoading(true);
    const response = await axios.post("/api/rooms", {
      currentDeckID: id,
      title: `Room for ${title}`,
    });
    if (response && response.status === 200 && response?.data?.id) {
      await router.push(`/rooms/${response.data.id}`);
    }
    setIsLoading(false);
  };
  return (
    <div
      className={`flex-none cursor-pointer rounded-lg shadow bg-blob-bg bg-center bg-cover w-64 mx-2 md:my-2 ${uiConfig.bgColor}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="p-8" src={uiConfig.imageUrl} alt="Deck Image" />
      <div className="px-5 pb-5 flex justify-between items-center">
        <h5 className="text-md tracking-tight text-gray-900">{title}</h5>
        <Button
          className={`w-20 ${uiConfig.buttonColor}`}
          onClick={handleButtonClick}
          isLoading={isLoading}
        >
          Play
        </Button>
      </div>
    </div>
  );
}

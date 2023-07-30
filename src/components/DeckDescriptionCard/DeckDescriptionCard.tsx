import { DeckType } from "@/models/Deck.model";
import React, { useState } from "react";
import Card from "@/components/Card";
import { CardPatternVariant } from "@/components/Card/Card";

type DeckDescriptionCardProps = {
  imageUrl?: string;
  deck: DeckType;
};

export default function DeckDescriptionCard({
  imageUrl,
  deck,
}: DeckDescriptionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const lineClamp = isExpanded ? "line-clamp-none" : "line-clamp-2";
  return (
    <Card className="flex" pattern={CardPatternVariant.Blob}>
      <div className="flex-none w-24 h-24">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="Deck icon" className="w-24 h-24" />
      </div>
      <div className="ml-4">
        <h1 className="text-lg text-gray-900">{deck.title}</h1>
        <p className={`text-sm text-gray-500 font-light mt-2 ${lineClamp}`}>
          {deck.description}
        </p>

        <span
          className="text-blue-600 text-sm ml-auto lg:hidden"
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? "Show less" : "Show more"}
        </span>
      </div>
    </Card>
  );
}

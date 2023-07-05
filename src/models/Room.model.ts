import { DeckType } from "@/models/Deck.model";

export type ParticipantType = {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
};

export type RoomType = {
  id?: string;
  createdBy: string;
  createdAt: string;
  title: string;
  currentDeck: DeckType;
  currentGameId?: string;
  participants: {
    [key: string]: ParticipantType;
  };
  admin: string;
};

export type ParticipantType = {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
};

export type RoomType = {
  createdBy: string;
  createdAt: string;
  title: string;
  currentDeckID: string;
  participants: {
    [key: string]: ParticipantType;
  };
  admin: string;
};

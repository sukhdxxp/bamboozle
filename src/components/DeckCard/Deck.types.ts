export type DeckType = {
  id: string;
  title: string;
  description: string;
};

export type DeckListType = [DeckType];

export type DeckCardProps = {
  deck: DeckType;
};

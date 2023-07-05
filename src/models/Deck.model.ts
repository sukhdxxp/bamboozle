export type DeckType = {
  id: string;
  title: string;
  description: string;
};

export type QnAItem = {
  question: string;
  answer: string;
};

export type MappedQnaType = {
  [key: string]: {
    question: string;
    answer: {
      id: string;
      text: string;
    };
  };
};

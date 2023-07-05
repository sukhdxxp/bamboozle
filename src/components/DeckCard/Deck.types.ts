export type QnAItem = {
  question: string;
  answer: {
    id: string;
    text: string;
  };
};

export type QnAType = {
  [key: string]: QnAItem;
};

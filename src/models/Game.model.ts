import { ParticipantType } from "@/models/Room.model";
import { QnAItem } from "@/components/DeckCard/Deck.types";
import { DeckType } from "@/models/Deck.model";

export enum GameState {
  UNKNOWN = "unknown",
  INIT = "init",
  WAITING_IN_LOBBY = "waiting_in_lobby",
  WRITE_TRICK_ANSWER = "write_trick_answer",
  PICK_ANSWER = "pick_correct_answer",
  FINISHED = "finished",
}

type ClientGameParticipantType = ParticipantType & {
  score: number;
};

type GameParticipantType = ClientGameParticipantType & {
  answers: {
    [key: string]: {
      // roundID
      correctAnswer: {
        [key: string]: string;
      };
      trickAnswer: {
        [key: string]: string;
      };
    };
  };
};

export type GameParticipantsType = {
  [key: string]: GameParticipantType;
};

export type ClientGameParticipantsType = {
  [key: string]: ClientGameParticipantType;
};

export type CurrentQuestionType = {
  question: string;
  answerOptions: {
    [key: string]: string;
  };
};

export type GameClientStateType = {
  state: GameState;
  deck?: DeckType;
  totalRounds?: number;
  currentRoundIndex: number;
  currentRoundDuration?: number;
  currentQuestion: CurrentQuestionType;
  participants: ClientGameParticipantsType;
};

export interface IGame {
  id?: string;
  clientState: GameClientStateType;
  qna: QnAItem[];
  participants: GameParticipantsType;
}

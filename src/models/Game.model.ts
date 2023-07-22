import { ParticipantType } from "@/models/Room.model";
import { DeckType, MappedQnaType } from "@/models/Deck.model";

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

export type ClientGameParticipantsType = {
  [key: string]: ClientGameParticipantType;
};

type GameScorecardItem = {
  score: number;
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

export type GameScorecard = {
  [key: string]: GameScorecardItem;
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
  deckId?: string;
  clientState: GameClientStateType;
  qna: MappedQnaType;
  scorecard: GameScorecard;
}

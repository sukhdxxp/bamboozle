import { v4 as uuidv4 } from "uuid";

import {
  GameClientStateType,
  GameParticipantsType,
  GameState,
  IGame,
} from "@/models/Game.model";
import { firebaseDatabase } from "./data/firebase-admin";
import { ParticipantType } from "@/models/Room.model";
import { QnAItem } from "@/components/DeckCard/Deck.types";
import { cleanupUndefinedValues, utils } from "@/utils/utils";
import { fetchValueFromDatabase } from "@/utils/db";
import { Deck } from "@/lib/deck";

const CONFIG = {
  totalRounds: 3,
  activeRoundDuration: 10000,
  waitingTime: 5000,
};

type GameConstructProps = {
  deckID?: string;
  participants?: { [p: string]: ParticipantType };
  gameID?: string;
};

export class Game implements IGame {
  id?: string;
  deckId?: string;
  clientState: GameClientStateType = {
    state: GameState.UNKNOWN,
    totalRounds: CONFIG.totalRounds,
    currentRoundIndex: 0,
    currentRoundDuration: CONFIG.waitingTime,
    participants: {},
    currentQuestion: {
      question: "",
      answerOptions: {},
    },
  };
  qna: QnAItem[] = [];
  participants: GameParticipantsType = {};

  constructor({ deckID, participants, gameID }: GameConstructProps) {
    if (gameID) {
      this.id = gameID;
    } else if (participants && deckID) {
      this.deckId = deckID;
      this.transformParticipantsToGameParticipants(participants);
    } else {
      throw new Error("[constructor]: Invalid Params");
    }
  }

  public async init() {
    if (this.id) {
      await this.populateGameFromDatabase(this.id);
    } else {
      await this.populateDeck();
      await this.populateQnA();
      await this.updateGameInDatabase();
    }
  }

  public async startNewRound() {
    if (this.clientState.state === GameState.FINISHED) {
      throw new Error(
        "[startNewRound]: Game is already finished. Cannot start new round"
      );
    }
    this.incrementRoundIndex();
    this.populateCurrentQnA();
    this.clientState.state = GameState.WRITE_TRICK_ANSWER;
    this.clientState.currentRoundDuration = CONFIG.activeRoundDuration;
    await this.updateGameInDatabase();
    setTimeout(() => {
      this.moveGameStateToAnswerPicker();
    }, this.clientState.currentRoundDuration);
  }

  async moveGameStateToAnswerPicker() {
    await this.populateGameFromDatabase(this.id);
    this.clientState.state = GameState.PICK_ANSWER;
    this.clientState.currentRoundDuration = CONFIG.activeRoundDuration;
    this.populateAnswerOptionsInCurrentQnA();
    await this.updateGameInDatabase();

    setTimeout(() => {
      this.endCurrentRound();
    }, this.clientState.currentRoundDuration);
  }

  populateCurrentQnA() {
    if (!this.qna || !this.clientState.currentRoundIndex) {
      throw new Error(
        "Game not properly initialized. QnA or current round index missing"
      );
    }
    this.clientState.currentQuestion = {
      question: this.qna[this.clientState.currentRoundIndex].question,
      answerOptions: {},
    };
  }

  incrementRoundIndex() {
    const currentIndex = this.clientState.currentRoundIndex || 0;
    this.clientState.currentRoundIndex = currentIndex + 1;
  }

  async populateGameFromDatabase(gameID?: string) {
    if (!gameID) {
      throw new Error("Game ID not provided to populate game from database");
    }
    const game = await fetchValueFromDatabase(`games/${gameID}`);
    if (!game) {
      throw new Error("Game not found");
    }
    this.id = gameID;
    this.deckId = game.deckId;
    this.clientState = game.clientState;
    this.qna = game.qna;
    this.participants = game.participants;
  }

  async updateGameInDatabase() {
    const game = cleanupUndefinedValues(this);
    if (!this.id) {
      const gameId = await firebaseDatabase.ref(`games`).push(game).key;
      if (!gameId) {
        throw new Error("Game ID not generated");
      }
      this.id = gameId;
    } else {
      await firebaseDatabase.ref(`games/${this.id}`).set(game);
    }
  }

  transformParticipantsToGameParticipants(
    participants: GameConstructProps["participants"]
  ) {
    if (!participants) {
      throw new Error("No participants provided");
    }
    Object.keys(participants).forEach((participantID) => {
      this.participants = {
        ...this.participants,
        [participantID]: {
          ...participants[participantID],
          score: 0,
          answers: {},
        },
      };
      this.clientState.participants = {
        ...this.clientState.participants,
        [participantID]: {
          ...participants[participantID],
          score: 0,
        },
      };
    });
  }

  async populateDeck() {
    if (!this.deckId) {
      throw new Error("Deck ID not provided");
    }
    const deck = new Deck(this.deckId);
    this.clientState.deck = await deck.retrieve();
  }

  async populateQnA() {
    if (!this.clientState.deck) {
      throw new Error("Deck not initialized");
    }
    const deckQna = await fetchValueFromDatabase(`deckQna/${this.deckId}`);
    const randomQnaDeck = utils(deckQna, this.clientState.totalRounds);

    this.qna = arrayToObject(randomQnaDeck);
  }

  private populateAnswerOptionsInCurrentQnA() {
    if (
      !this.clientState.currentQuestion.question ||
      !this.clientState.currentRoundIndex
    ) {
      throw new Error("Game not in healthy state");
    }
    const currentRoundIndex = this.clientState.currentRoundIndex;
    const currentAnswerOptions = {
      [this.qna[currentRoundIndex].answer.id]:
        this.qna[currentRoundIndex].answer.text,
    };

    Object.keys(this.participants || {}).forEach((participantID) => {
      const participant = this.participants?.[participantID];
      const participantAnswers = participant?.answers || {};
      const participantCurrentAnswer = participantAnswers[currentRoundIndex];
      if (participantCurrentAnswer) {
        const trickAnswer = participantCurrentAnswer.trickAnswer || {};
        const trickAnswerId = Object.keys(trickAnswer)[0];
        currentAnswerOptions[trickAnswerId] = trickAnswer[trickAnswerId];
      }
    });

    this.clientState.currentQuestion = {
      question: this.clientState.currentQuestion.question,
      answerOptions: currentAnswerOptions,
    };
  }

  private async endCurrentRound() {
    if (!this.clientState.currentQuestion.question || !this.participants) {
      throw new Error("Current QnA or participants not initialized");
    }
    await this.populateGameFromDatabase(this.id);
    const currentRoundIndex = this.clientState.currentRoundIndex || 0;
    const answer = this.qna[currentRoundIndex].answer;
    Object.keys(this.participants).forEach((participantID) => {
      const participant = this.participants?.[participantID];
      if (!participant) {
        throw new Error("Participant not found");
      }
      const participantAnswers = participant.answers[currentRoundIndex];
      const correctAnswer = Object.values(participantAnswers.correctAnswer)[0];
      if (correctAnswer === answer.id) {
        participant.score += 1;
      }

      const trickAnswerId = Object.keys(
        participantAnswers.trickAnswer || {}
      )[0];
      Object.keys(this.participants || {}).forEach((participantID) => {
        const competitor = this.participants?.[participantID];
        const competitorCorrectAnswer =
          competitor?.answers[currentRoundIndex].correctAnswer || {};
        const competitorCorrectAnswerId = Object.values(
          competitorCorrectAnswer
        )[0];
        if (competitorCorrectAnswerId === trickAnswerId) {
          participant.score += 1;
        }
      });
    });
    if (currentRoundIndex === this.clientState.totalRounds) {
      this.clientState.state = GameState.FINISHED;
    } else {
      this.clientState.state = GameState.WAITING_IN_LOBBY;
    }
    await this.updateGameInDatabase();
  }

  public getId() {
    if (!this.id) {
      throw new Error("Game ID not generated");
    }
    return this.id;
  }
}

const arrayToObject = (array: any[]) => {
  const obj: any = {};
  array.forEach((item, index) => {
    obj[index + 1] = {
      question: item.question,
      answer: {
        id: uuidv4(),
        text: item.answer,
      },
    };
  });
  return obj;
};

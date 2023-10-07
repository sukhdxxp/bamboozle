import {
  GameClientStateType,
  GameScorecard,
  GameState,
  IGame,
} from "@/models/Game.model";
import { firebaseDatabase } from "./data/firebase-admin";
import { ParticipantType } from "@/models/Room.model";
import { cleanupUndefinedValues } from "@/utils/utils";
import { fetchValueFromDatabase } from "@/utils/db";
import { Deck } from "@/lib/deck";
import { MappedQnaType } from "@/models/Deck.model";

const GAME_CONFIG = {
  totalRounds: 3,
  activeRoundDuration: 30 * 1000,
  waitingTime: 5000,
};

type GameConstructProps = {
  deckID?: string;
  participants?: { [p: string]: ParticipantType };
};

export class Game implements IGame {
  id?: string;
  deckId?: string;
  clientState: GameClientStateType = {
    state: GameState.UNKNOWN,
    totalRounds: GAME_CONFIG.totalRounds,
    currentRoundIndex: 0,
    currentRoundDuration: GAME_CONFIG.waitingTime,
    participants: {},
    currentQuestion: {
      question: "",
      answerOptions: {},
    },
  };
  qna: MappedQnaType = {};
  scorecard: GameScorecard = {};

  constructor({ deckID, participants }: GameConstructProps) {
    if (!participants || !deckID) {
      throw new Error("[constructor]: Invalid Params");
    }
    this.deckId = deckID;
    this.transformParticipantsToGameParticipants(participants);
  }

  static async read(gameID: string) {
    if (!gameID) {
      throw new Error("Game ID not provided");
    }
    const gameData = await Game.fetchGameFromDatabase(gameID);
    gameData.id = gameID;
    const game = new Game({
      deckID: gameData.deckId,
      participants: gameData.clientState.participants,
    });
    game.updateLocalGameState(gameData);
    return game;
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
    this.clientState.currentRoundDuration = GAME_CONFIG.activeRoundDuration;
    await this.updateGameInDatabase();
    setTimeout(() => {
      this.moveGameStateToAnswerPicker();
    }, this.clientState.currentRoundDuration);
  }

  public getId() {
    if (!this.id) {
      throw new Error("Game ID not generated");
    }
    return this.id;
  }

  private transformParticipantsToGameParticipants(
    participants: GameConstructProps["participants"]
  ) {
    if (!participants) {
      throw new Error("No scorecard provided");
    }
    this.scorecard = {};
    Object.keys(participants).forEach((participantID) => {
      this.clientState.participants = {
        ...this.clientState.participants,
        [participantID]: {
          ...participants[participantID],
          score: 0,
          lastRound: {
            tricked: [],
          },
        },
      };
      this.scorecard[participantID] = {
        score: 0,
        answers: {},
        lastRound: {
          tricked: [],
        },
      };
    });
  }

  private async moveGameStateToAnswerPicker() {
    await this.populateGameFromDatabase(this.id);
    this.clientState.state = GameState.PICK_ANSWER;
    this.clientState.currentRoundDuration = GAME_CONFIG.activeRoundDuration;
    this.populateAnswerOptionsInCurrentQnA();
    await this.updateGameInDatabase();

    setTimeout(() => {
      this.endCurrentRound();
    }, this.clientState.currentRoundDuration);
  }

  private populateCurrentQnA() {
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

  private incrementRoundIndex() {
    this.clientState.currentRoundIndex = this.clientState.currentRoundIndex + 1;
  }

  private async updateGameInDatabase() {
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

  private async populateDeck() {
    if (!this.deckId) {
      throw new Error("Deck ID not provided");
    }
    const deck = new Deck(this.deckId);
    this.clientState.deck = await deck.get();
  }

  private async populateQnA() {
    if (!this.deckId || !this.clientState.totalRounds) {
      throw new Error("Deck ID or total rounds not provided");
    }
    const deck = new Deck(this.deckId);
    this.qna = await deck.getRandomQnaItems(this.clientState.totalRounds);
  }

  private async populateGameFromDatabase(gameID?: string) {
    if (!gameID) {
      throw new Error("Game ID not provided to populate game from database");
    }
    const game = await Game.fetchGameFromDatabase(gameID);
    game.id = gameID;
    this.updateLocalGameState(game);
  }

  updateLocalGameState(game: IGame) {
    this.id = game.id;
    this.deckId = game.deckId;
    this.clientState = game.clientState;
    this.qna = game.qna;
    this.scorecard = game.scorecard;
  }

  static async fetchGameFromDatabase(gameID: string) {
    const game = await fetchValueFromDatabase(`games/${gameID}`);
    if (!game) {
      throw new Error("Game not found");
    }
    return game as IGame;
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

    Object.keys(this.scorecard || {}).forEach((participantID) => {
      const participant = this.scorecard?.[participantID];
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
    if (!this.clientState.currentQuestion.question || !this.scorecard) {
      throw new Error("Current QnA or scorecard not initialized");
    }
    await this.populateGameFromDatabase(this.id);
    const currentRoundIndex = this.clientState.currentRoundIndex || 0;
    const answer = this.qna[currentRoundIndex].answer;
    Object.keys(this.scorecard).forEach((participantID) => {
      const participant = this.scorecard?.[participantID];
      if (!participant) {
        throw new Error("Participant not found");
      }
      const participantAnswers = participant.answers[currentRoundIndex];
      const correctAnswer = Object.values(
        participantAnswers.correctAnswer || {}
      )[0];
      if (correctAnswer === answer.id) {
        participant.score += 1;
      }

      const trickAnswerId = Object.keys(
        participantAnswers.trickAnswer || {}
      )[0];
      Object.keys(this.scorecard || {}).forEach((participantID) => {
        const competitor = this.scorecard?.[participantID];
        const competitorCorrectAnswer =
          competitor?.answers[currentRoundIndex].correctAnswer || {};
        const competitorCorrectAnswerId = Object.values(
          competitorCorrectAnswer
        )[0];
        if (competitorCorrectAnswerId === trickAnswerId) {
          participant.score += 1;
        }
      });
      this.clientState.participants[participantID].score = participant.score;
    });
    if (currentRoundIndex === this.clientState.totalRounds) {
      this.clientState.state = GameState.FINISHED;
    } else {
      this.clientState.state = GameState.WAITING_IN_LOBBY;
    }
    await this.updateGameInDatabase();
  }
}

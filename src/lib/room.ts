import { fetchValueFromDatabase } from "@/utils/db";
import { cleanupUndefinedValues } from "@/utils/utils";
import { Deck } from "@/lib/deck";
import { auth } from "firebase-admin";
import DecodedIdToken = auth.DecodedIdToken;
import { ParticipantType, RoomType } from "@/models/Room.model";
import { firebaseDatabase } from "@/lib/data/firebase-admin";
import { DeckType } from "@/models/Deck.model";

type createRoomProps = {
  currentDeckID: string;
  user: DecodedIdToken;
};

export class Room {
  id: string;
  createdBy?: string;
  createdAt?: string;
  title?: string;
  currentDeck?: DeckType;
  participants?: {
    [key: string]: ParticipantType;
  };
  admin?: string;
  currentGameId?: string;

  constructor(id: string) {
    if (!id) {
      throw new Error("[room-constructor]: Invalid Params");
    }
    this.id = id;
  }

  public async populateFromDatabase() {
    const data = await this.retrieveFromDatabase();
    this.createdBy = data.createdBy;
    this.createdAt = data.createdAt;
    this.title = data.title;
    this.currentDeck = data.currentDeck;
    this.participants = data.participants;
    this.currentGameId = data.currentGameId;
    this.admin = data.admin;
  }

  public async retrieveFromDatabase() {
    return (await fetchValueFromDatabase(
      `rooms/${this.id}`
    )) as Promise<RoomType>;
  }

  public async saveToDatabase() {
    const data = cleanupUndefinedValues(this);
    await firebaseDatabase.ref(`rooms/${this.id}`).set(data);
  }

  public getParticipants() {
    if (!this.participants) {
      throw new Error("[room-getParticipants]: No participants");
    }
    return this.participants;
  }

  public async setCurrentGameId(gameId: string) {
    this.currentGameId = gameId;
    await this.saveToDatabase();
  }

  public getCurrentDeckId() {
    if (!this.currentDeck)
      throw new Error("[room-getCurrentDeckId]: No current deck");
    return this.currentDeck.id;
  }

  static async create({ currentDeckID, user }: createRoomProps) {
    const currentParticipant = Room.createParticipantFromUser(user);

    const deck = new Deck(currentDeckID);
    const deckData = await deck.retrieve();

    const room: RoomType = {
      createdBy: user.uid,
      createdAt: new Date().toISOString(),
      title: `Room for ${deckData.title}`,
      currentDeck: deckData,
      participants: {
        [user.uid]: currentParticipant,
      },
      admin: user.uid,
    };

    const roomReference = await firebaseDatabase.ref("rooms").push(room).key;

    if (roomReference) {
      return new Room(roomReference);
    } else {
      throw new Error("[room-create]: Unable to create room");
    }
  }

  static createParticipantFromUser(user: DecodedIdToken): ParticipantType {
    return {
      id: user.uid,
      name: user.name,
      avatar: user.picture || "",
      isOnline: false,
      lastSeen: new Date().toISOString(),
    };
  }
}

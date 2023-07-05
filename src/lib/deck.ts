import { fetchValueFromDatabase } from "@/utils/db";
import { DeckType } from "@/models/Deck.model";

export class Deck {
  id: string;
  constructor(id: string) {
    if (!id) {
      throw new Error("[deck-constructor]: Invalid Params");
    }
    this.id = id;
  }

  public async retrieve() {
    const data = await fetchValueFromDatabase(`decks/${this.id}`);
    return {
      ...data,
      id: this.id,
    } as DeckType;
  }
}

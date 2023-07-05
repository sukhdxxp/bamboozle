import { fetchValueFromDatabase } from "@/utils/db";
import { DeckType, MappedQnaType, QnAItem } from "@/models/Deck.model";
import { getRandomArraySubset } from "@/utils/utils";
import { v4 as uuidv4 } from "uuid";

export class Deck {
  id: string;
  constructor(id: string) {
    if (!id) {
      throw new Error("[deck-constructor]: Invalid Params");
    }
    this.id = id;
  }

  public async get() {
    const data = await fetchValueFromDatabase(`decks/${this.id}`);
    return {
      ...data,
      id: this.id,
    } as DeckType;
  }

  public async getRandomQnaItems(count: number) {
    const allQnaItems = await this.getQnAItems();
    const qnaItemSubset = getRandomArraySubset(allQnaItems, count);
    return this.qnaItemMapper(qnaItemSubset);
  }

  private async getQnAItems() {
    const data = await fetchValueFromDatabase(`deckQna/${this.id}`);
    return data as QnAItem[];
  }

  private qnaItemMapper(qnaItems: QnAItem[]) {
    const obj: MappedQnaType = {};
    qnaItems.forEach((item, index) => {
      obj[index + 1] = {
        question: item.question,
        answer: {
          id: uuidv4(),
          text: item.answer,
        },
      };
    });
    return obj;
  }
}

import { ColorVariant } from "@/components/common/uiConfig";

export enum Decks {
  BOOKS = "5c31acda71d37ab784ca76b9",
  MOVIES = "5c31acda71d37ab784ca76ba",
  FACT = "5c31acda71d37ab784ca76bb",
  SWITCH = "5c31acda71d37ab784ca76bc",
  TV = "5c31acda71d37ab784ca76bd",
  POETRY = "5c31acda71d37ab784ca76be",
  PLOT = "5c31acda71d37ab784ca76bf",
  GUESS_NAME = "5c31acda71d37ab784ca76c0",
  PROVERBS = "5c31acda71d37ab784ca76c1",
  LAW = "5c31acda71d37ab784ca76c2",
  ADULTS = "5c31acda71d37ab784ca76c3",
  ANIMALS = "5c31acda71d37ab784ca76c4",
}

const baseImageUrl =
  "https://res.cloudinary.com/bamboozle/image/upload/v1688823702/bamboozle/categories";

export const getDeckUiConfig = (id: string) => {
  switch (id) {
    case Decks.BOOKS:
      return {
        color: ColorVariant.Rose,
        imageUrl: `${baseImageUrl}/books.png`,
      };
    case Decks.MOVIES:
      return {
        color: ColorVariant.Teal,
        imageUrl: `${baseImageUrl}/movies.png`,
      };
    case Decks.FACT:
      return {
        color: ColorVariant.Violet,
        imageUrl: `${baseImageUrl}/bulb.png`,
      };
    case Decks.SWITCH:
      return {
        color: ColorVariant.Amber,
        imageUrl: `${baseImageUrl}/book2.png`,
      };
    case Decks.TV:
      return {
        color: ColorVariant.Rose,
        imageUrl: `${baseImageUrl}/television.png`,
      };
    case Decks.POETRY:
      return {
        color: ColorVariant.Teal,
        imageUrl: `${baseImageUrl}/poetry.png`,
      };
    case Decks.PLOT:
      return {
        color: ColorVariant.Violet,
        imageUrl: `${baseImageUrl}/coffee.png`,
      };
    case Decks.GUESS_NAME:
      return {
        color: ColorVariant.Amber,
        imageUrl: `${baseImageUrl}/teddy-bear.png`,
      };
    case Decks.PROVERBS:
      return {
        color: ColorVariant.Rose,
        imageUrl: `${baseImageUrl}/books.png`,
      };
    case Decks.LAW:
      return {
        color: ColorVariant.Teal,
        imageUrl: `${baseImageUrl}/scale.png`,
      };
    case Decks.ADULTS:
      return {
        color: ColorVariant.Violet,
        imageUrl: `${baseImageUrl}/lips.png`,
      };
    case Decks.ANIMALS:
      return {
        color: ColorVariant.Amber,
        imageUrl: `${baseImageUrl}/dog.png`,
      };

    default:
      return {
        color: ColorVariant.Teal,
      };
  }
};

import DeckIcon from "../DeckIcon";
import { DeckCardProps } from "./Deck.types";
import styles from "./DeckCard.module.css";

export default function CategoryCard({
  deck: { id, title, description },
}: DeckCardProps) {
  return (
    <div className="cursor-pointer p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex">
      <DeckIcon id={id} className="w-16 h-16 flex-none"/>
      <div className={styles.details}>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h2>
        <div className="font-light mt-1 text-gray-700 dark:text-gray-400 line-clamp-2">
          {description}
        </div>
      </div>
    </div>
  );
}

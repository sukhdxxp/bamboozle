import DeckIcon from "../DeckIcon";
import styles from "./DeckCard.module.css";
import { DeckType } from "@/models/Deck.model";

type DeckCardProps = {
  deck: DeckType;
  shouldCollapseDescription?: boolean;
};
export default function DeckCard({
  deck: { id, title, description },
  shouldCollapseDescription = true,
}: DeckCardProps) {
  const collapsed = shouldCollapseDescription ? "line-clamp-2" : "";
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex">
      <DeckIcon id={id} className="w-16 h-16 flex-none" />
      <div className={styles.details}>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h2>
        <div
          className={`font-light mt-1 text-gray-700 dark:text-gray-400 ${collapsed}`}
        >
          {description}
        </div>
      </div>
    </div>
  );
}

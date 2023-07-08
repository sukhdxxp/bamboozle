import DeckIcon from "../DeckIcon";
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
    <div className="flex items-stretch relative border border-gray-200 rounded-lg drop-shadow-md hover:bg-gray-100  bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-100">
      <div className="flex items-center content-center flex-none w-24 relative before:content[''] before:absolute before:w-1/2 before:h-full before:block before:bg-slate-50 before:top-0 before:left-0 before:-z-10 before:opacity-25 after:content[''] after:absolute after:h-full after:w-1/2 after:block  after:bg-slate-50 after:right-0 after:top-0 after:opacity-25 after:rounded-tr-full after:rounded-br-full">
        <DeckIcon id={id} className="ml-4 w-12 h-12 z-10 text-slate-100" />
      </div>
      <div className="flex-3 ml-2 p-4">
        <h2 className="mb-1 text-md tracking-tight text-slate-100">{title}</h2>
        <div className={`font-light text-sm text-slate-100 ${collapsed}`}>
          {description}
        </div>
      </div>
    </div>
  );
}

//relative h-full bg-red before:content[''] before:absolute before:w-24 before:h-full before:rounded-full before:block before:bg-slate-50 opacity-5 before:top-0 before:-left-12 overflow-hidden

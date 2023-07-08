import { GameClientStateType } from "@/models/Game.model";

type GameScoreCardProps = {
  game: GameClientStateType;
};
export default function GameScoreCard({ game }: GameScoreCardProps) {
  const { participants } = game;
  const sortedParticipants = Object.values(participants).sort((a, b) => {
    return b.score - a.score;
  });
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex">
      <div className="flex flex-col">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Scoreboard
        </h2>
        <div className="flex flex-col">
          {sortedParticipants.map((participant) => (
            <div key={participant.id} className="flex justify-between">
              <div>{participant.name}</div> - <div>{participant.score}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

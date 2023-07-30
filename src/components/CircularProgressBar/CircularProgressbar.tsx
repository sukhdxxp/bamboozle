import { useEffect, useState } from "react";

export default function CircularProgressBar({
  duration = 30,
}: {
  duration?: number;
}) {
  const durationInSeconds = duration / 1000;
  const radius = 30;
  const circumference = 30 * 2 * Math.PI;
  const [secondsRemaining, setSecondsRemaining] = useState(durationInSeconds);
  const progressEachSecond = 100 / durationInSeconds;
  const progress = Math.floor(secondsRemaining * progressEachSecond);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((secondsRemaining) => {
        if (secondsRemaining === 0) {
          clearInterval(interval);
          return 0;
        }
        return secondsRemaining - 1;
      });
    }, 1000);
  }, [durationInSeconds]);

  return (
    <div
      x-data="scrollProgress"
      className="inline-flex items-center justify-center overflow-hidden rounded-full bottom-5 left-5"
    >
      <svg className="w-20 h-20">
        <circle
          className="text-gray-300"
          strokeWidth="5"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40"
        />
        <circle
          className="text-blue-600"
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (progress / 100) * circumference}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40"
        />
      </svg>
      <span className="absolute text-l text-blue-700">{secondsRemaining}</span>
    </div>
  );
}

import React, { useEffect, useState } from "react";

type ProgressProps = {
  duration?: number;
};

const ProgressBar: React.FC<ProgressProps> = ({ duration = 3000 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedTime = now - startTime;
      const percentage = Math.min((elapsedTime / duration) * 100, 100);
      setProgress(percentage);

      if (now >= endTime) {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div className="h-1.5 rounded-full" style={{ width: "100%" }}>
      <div
        className={`bg-blue-500 h-1.5 rounded-full transition-all`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;

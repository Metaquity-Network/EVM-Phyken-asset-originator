import React, { useEffect, useState } from 'react';

const ProgressBar = ({ percentage }: { percentage: number }) => {
  const [dynamicPercentage, setDynamicPercentage] = useState(0);

  useEffect(() => {
    const incrementStep = 1;
    const animationDuration = 10;

    if (dynamicPercentage < percentage) {
      const interval = setInterval(() => {
        setDynamicPercentage((prevPercentage) => Math.min(prevPercentage + incrementStep, percentage));
      }, animationDuration);

      return () => clearInterval(interval);
    }
  }, [dynamicPercentage, percentage]);

  const progressBarStyle = {
    width: `${dynamicPercentage}%`,
    transition: `width 1ms ease-in-out`,
  };

  return (
    <div className="relative h-2.5 w-full rounded-full bg-stroke dark:bg-strokedark">
      <div className={`absolute left-0 h-full w-4/5 rounded-full bg-primary`} style={progressBarStyle}>
        <span className="absolute bottom-full -right-4 z-1 mb-2 inline-block rounded-sm bg-primary px-2 py-1 text-xs font-bold text-white">
          <span className="absolute -bottom-1 left-1/2 -z-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-primary"></span>
          {dynamicPercentage.toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;

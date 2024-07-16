
import React from "react";

type Props = {
  time: Date;
};

const Time = ({ time }: Props) => {
  const formattedTime = time.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  // Function to capitalize AM and PM
  const capitalizeAMPM = (timeString: string) => {
    return timeString.replace(/\b(am|pm)\b/gi, match => match.toUpperCase());
  };

  return <span>{capitalizeAMPM(formattedTime)}</span>;
};

export default Time;

import { useState, useEffect } from "react";

const useUsabilityMetrics = (componentName) => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTimeSpent((t) => t + 1), 1000);
    const clickHandler = () => setClicks((c) => c + 1);

    window.addEventListener("click", clickHandler);

    return () => {
      clearInterval(timer);
      window.removeEventListener("click", clickHandler);
    };
  }, [componentName]);

  return { timeSpent, clicks };
};

export default useUsabilityMetrics;

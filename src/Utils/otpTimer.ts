import { useState, useEffect } from "react";

const TIMER_DURATION = 60 * 1000; // 60 seconds in milliseconds

export function useOtpTimer() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const endTimeStr = localStorage.getItem("otpTimerEnd");
    if (endTimeStr) {
      const endTime = parseInt(endTimeStr, 10);
      const now = Date.now();
      if (endTime > now) {
        setTimeLeft(Math.ceil((endTime - now) / 1000));
      } else {
        localStorage.removeItem("otpTimerEnd");
      }
    }
  }, []);

  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      const endTimeStr = localStorage.getItem("otpTimerEnd");
      if (endTimeStr) {
        const endTime = parseInt(endTimeStr, 10);
        const now = Date.now();
        if (endTime > now) {
          setTimeLeft(Math.ceil((endTime - now) / 1000));
        } else {
          clearInterval(timer);
          localStorage.removeItem("otpTimerEnd");
          setTimeLeft(null);
        }
      } else {
        clearInterval(timer);
        setTimeLeft(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const startTimer = () => {
    const endTime = Date.now() + TIMER_DURATION;
    localStorage.setItem("otpTimerEnd", endTime.toString());
    setTimeLeft(TIMER_DURATION / 1000);
  };

  return { timeLeft, startTimer };
}

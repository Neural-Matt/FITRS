"use client";

import { useState, useEffect } from "react";

type ElapsedTimeProps = {
  createdAt: Date;
  showPulse?: boolean;
};

export function ElapsedTime({ createdAt, showPulse = true }: ElapsedTimeProps) {
  const [elapsed, setElapsed] = useState({ minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const diff = Date.now() - createdAt.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setElapsed({ minutes, seconds });
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [createdAt]);

  const isOverdue = elapsed.minutes >= 20;
  const isWarning = elapsed.minutes >= 10 && elapsed.minutes < 20;

  const bgColor = isOverdue ? "bg-red-100" : isWarning ? "bg-amber-100" : "bg-emerald-100";
  const textColor = isOverdue ? "text-red-700" : isWarning ? "text-amber-700" : "text-emerald-700";
  const pulse = showPulse && isOverdue ? "animate-pulse" : "";

  return (
    <div
      className={`${bgColor} ${textColor} ${pulse} inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold`}
    >
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      {elapsed.minutes}m {elapsed.seconds}s
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { TimeLeft } from "./types";

const pad = (value: number) => String(Math.max(0, value)).padStart(2, "0");

function getTimeLeft(target: number): TimeLeft {
  const diff = Math.max(0, target - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;
  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  };
}

/**
 * Live countdown to an ISO target date. Returns `null` until mounted so the
 * server and first client render stay identical (no hydration mismatch), then
 * ticks every second so the displayed value updates the moment it changes.
 */
export function useCountdown(targetIso: string): TimeLeft | null {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const target = new Date(targetIso).getTime();
    const update = () => setTimeLeft(getTimeLeft(target));

    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [targetIso]);

  return timeLeft;
}

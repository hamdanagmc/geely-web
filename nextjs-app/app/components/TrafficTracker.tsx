"use client";

import { useTrafficSource } from "@/app/hooks/useTrafficSource";

export default function TrafficTracker() {
  useTrafficSource(); // This runs the logic on the client
  return null; // This component doesn't render anything
}
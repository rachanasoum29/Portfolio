"use client";

import { useEffect, useState } from "react";
import PageLoader from "./PageLoader";

interface GlobalPageLoaderProps {
  /** Duration in milliseconds to display the loader on initial site entrance. Defaults to 2000ms */
  minDuration?: number;
}

/**
 * GlobalPageLoader displays the full-screen loader ONLY when the website is loading
 * (initial page visit / browser refresh), and smoothly fades out once complete.
 * It does NOT trigger when clicking links or navigating between pages.
 */
export function GlobalPageLoader({ minDuration = 2000 }: GlobalPageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show on initial website load / refresh, then smoothly fade out
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minDuration);

    // Optional: allow explicit manual data refresh events if triggered programmatically
    const handleStart = () => setIsLoading(true);
    const handleStop = () => setIsLoading(false);

    window.addEventListener("page-loader:start", handleStart);
    window.addEventListener("page-loader:stop", handleStop);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("page-loader:start", handleStart);
      window.removeEventListener("page-loader:stop", handleStop);
    };
  }, [minDuration]);

  return <PageLoader isLoading={isLoading} minDuration={minDuration} />;
}

export default GlobalPageLoader;

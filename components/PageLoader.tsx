"use client";

import React, { useEffect, useState } from "react";

export interface PageLoaderProps {
  /** Explicit control over loading state. When provided, controls visibility and initiates fade-out when false. */
  isLoading?: boolean;
  /** Minimum duration to show loader in milliseconds. Defaults to 1500ms */
  minDuration?: number;
  /** Image URL for brand logo. Defaults to "/images/logo.png" */
  logoSrc?: string | null;
  /** Alt text for logo */
  logoAlt?: string;
  /** Force inverting logo (recommended for dark logos on black background) */
  invertLogo?: boolean;
  /** Label underneath progress bar. Defaults to "Loading..." */
  text?: string;
  /** Additional container classes */
  className?: string;
}

export default function PageLoader({
  isLoading,
  minDuration = 1500,
  logoSrc = "/images/logo.png",
  logoAlt = "Logo",
  invertLogo,
  text = "Loading...",
  className = "",
}: PageLoaderProps) {
  const [visible, setVisible] = useState(isLoading ?? true);
  const [mounted, setMounted] = useState(isLoading ?? true);

  useEffect(() => {
    if (isLoading !== undefined) {
      if (isLoading) {
        setMounted(true);
        setVisible(true);
      } else {
        setVisible(false);
      }
      return;
    }

    // Keep visible for minDuration (~1.5s) so the progress bar animates smoothly from 0% to 100%
    const timer = setTimeout(() => {
      setVisible(false);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [isLoading, minDuration]);

  useEffect(() => {
    if (!visible) {
      // Remove from DOM after transition-opacity duration-700 finishes
      const unmountTimer = setTimeout(() => {
        setMounted(false);
      }, 700);
      return () => clearTimeout(unmountTimer);
    }
  }, [visible]);

  if (!mounted) return null;

  // By default invert dark brand logos like /images/logo.png so they shine against pure black
  const shouldInvert =
    invertLogo ?? (typeof logoSrc === "string" && logoSrc.includes("logo.png"));

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center select-none transition-opacity duration-700 ease-out ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      } ${className}`}
    >
      {/* Centered Logo with Subtle Pulse/Breathing Animation */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        {logoSrc ? (
          <img
            src={logoSrc}
            alt={logoAlt}
            className={`w-full h-full object-contain animate-pulse ${
              shouldInvert ? "brightness-0 invert drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]" : ""
            }`}
          />
        ) : (
          <div className="w-12 h-12 rounded-full border-2 border-[#ff5c35]/40 border-t-[#ff5c35] animate-spin" />
        )}
      </div>

      {/* Sleek Thin Progress Bar Track */}
      <div className="w-64 h-[3px] bg-neutral-800 rounded-full overflow-hidden mt-8 relative">
        <div className="h-full bg-[#ff5c35] rounded-full animate-loader-bar" />
      </div>

      {/* Small 'Loading...' Text Centered Beneath the Progress Bar */}
      <span className="text-neutral-300 text-xs font-medium tracking-wide mt-2">
        {text}
      </span>

      <style>{`
        @keyframes loaderBar {
          0% {
            width: 0%;
          }
          40% {
            width: 55%;
          }
          75% {
            width: 85%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-loader-bar {
          animation: loaderBar 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>
    </div>
  );
}

export { PageLoader };

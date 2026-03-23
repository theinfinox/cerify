"use client";

import { useEffect } from "react";

export const SplashScreen: React.FC = () => {
  useEffect(() => {
    // Fire the signal to the global Vanilla JavaScript native loader
    // to let it know React has successfully downloaded, parsed, and hydrated the interactive DOM.
    if (typeof window !== 'undefined') {
      (window as any).__certify_hydrated = true;
    }
  }, []);

  return null;
};

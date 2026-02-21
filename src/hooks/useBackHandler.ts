import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Map sub-pages to their parent routes
const PARENT_ROUTES: Record<string, string> = {
  "/surah": "/",
  "/surah-read": "/surah",
  "/mushaf": "/",
  "/read-quran": "/",
  "/tafseer-reader": "/",
  "/tafseer-read": "/tafseer-reader",
  "/azaan-settings": "/prayer-times",
  "/donate": "/",
};

function getParentRoute(pathname: string): string {
  // Check exact match first
  if (PARENT_ROUTES[pathname]) return PARENT_ROUTES[pathname];
  // Check prefix match for dynamic routes like /surah-read/5
  for (const prefix of Object.keys(PARENT_ROUTES)) {
    if (pathname.startsWith(prefix + "/")) return PARENT_ROUTES[prefix];
  }
  // Default: go home
  return "/";
}

export function useBackHandler() {
  const [showExitDialog, setShowExitDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const handleBack = useCallback(() => {
    if (isHome) {
      setShowExitDialog(true);
    } else {
      const parent = getParentRoute(location.pathname);
      navigate(parent);
    }
  }, [isHome, navigate, location.pathname]);

  useEffect(() => {
    if (!isHome) return; // Only intercept popstate on home page

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
      setShowExitDialog(true);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isHome]);

  // Capacitor hardware back button
  useEffect(() => {
    let backButtonListener: any = null;
    const setupCapacitor = async () => {
      try {
        const { App } = await import("@capacitor/app");
        backButtonListener = await App.addListener("backButton", () => {
          handleBack();
        });
      } catch {
        // Not running in Capacitor
      }
    };
    setupCapacitor();
    return () => {
      if (backButtonListener) backButtonListener.remove();
    };
  }, [handleBack]);

  const confirmExit = useCallback(async () => {
    setShowExitDialog(false);
    try {
      const { App } = await import("@capacitor/app");
      await App.exitApp();
    } catch {
      window.close();
      window.location.href = "about:blank";
    }
  }, []);

  const cancelExit = useCallback(() => {
    setShowExitDialog(false);
  }, []);

  return { showExitDialog, confirmExit, cancelExit, handleBack };
}

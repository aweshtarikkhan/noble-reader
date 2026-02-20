import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useBackHandler() {
  const [showExitDialog, setShowExitDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const handleBack = useCallback(() => {
    if (isHome) {
      setShowExitDialog(true);
    } else {
      navigate(-1);
    }
  }, [isHome, navigate]);

  useEffect(() => {
    // Browser back button handling
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
      handleBack();
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    // Capacitor hardware back button
    let backButtonListener: any = null;
    const setupCapacitor = async () => {
      try {
        const { App } = await import("@capacitor/app");
        backButtonListener = await App.addListener("backButton", ({ canGoBack }) => {
          handleBack();
        });
      } catch {
        // Not running in Capacitor, ignore
      }
    };
    setupCapacitor();

    return () => {
      window.removeEventListener("popstate", handlePopState);
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

  return { showExitDialog, confirmExit, cancelExit };
}

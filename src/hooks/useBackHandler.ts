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
    // Push a dummy state so we can intercept the back button
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      // Re-push state to prevent actual navigation
      window.history.pushState(null, "", window.location.href);
      handleBack();
    };

    // Push initial state
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handleBack]);

  const confirmExit = useCallback(() => {
    setShowExitDialog(false);
    // For Capacitor/native apps
    if ((window as any).Capacitor?.Plugins?.App) {
      (window as any).Capacitor.Plugins.App.exitApp();
    } else {
      // For PWA/browser - close the window
      window.close();
      // Fallback: navigate away
      window.location.href = "about:blank";
    }
  }, []);

  const cancelExit = useCallback(() => {
    setShowExitDialog(false);
  }, []);

  return { showExitDialog, confirmExit, cancelExit };
}

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored ? stored === "dark" : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark((d) => !d)}
      className="w-9 h-9 flex items-center justify-center rounded-xl bg-card transition-smooth hover:bg-muted active:scale-90"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun size={18} className="text-gold" />
      ) : (
        <Moon size={18} className="text-foreground" />
      )}
    </button>
  );
};

export default ThemeToggle;

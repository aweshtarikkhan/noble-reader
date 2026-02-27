import React from "react";

export type ReadingStyle = "indopak" | "saudi" | "text";

interface StyleSwitcherProps {
  style: ReadingStyle;
  onChange: (style: ReadingStyle) => void;
}

const StyleSwitcher: React.FC<StyleSwitcherProps> = ({ style, onChange }) => {
  const options: { key: ReadingStyle; label: string }[] = [
    { key: "indopak", label: "🇮🇳 Indo-Pak (16 Line)" },
    { key: "saudi", label: "🇸🇦 Saudi Style" },
    { key: "text", label: "📝 Line by Line" },
  ];

  return (
    <div className="flex bg-card rounded-xl p-1 border border-primary/10 mb-4 animate-fade-in">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-smooth ${
            style === opt.key
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default StyleSwitcher;

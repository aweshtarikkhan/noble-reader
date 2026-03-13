import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply saved font size on load
const FONT_SIZES: Record<string, string> = { small: "14px", medium: "16px", large: "18px", xlarge: "20px" };
const savedSize = localStorage.getItem("font_size") || "medium";
document.documentElement.style.fontSize = FONT_SIZES[savedSize] || "16px";

createRoot(document.getElementById("root")!).render(<App />);

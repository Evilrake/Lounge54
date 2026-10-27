import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const storedTheme = localStorage.getItem("lounge54-theme");
document.documentElement.dataset.theme = storedTheme === "light" ? "light" : "dark";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

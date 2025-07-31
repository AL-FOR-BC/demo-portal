import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./scss/rightbar.scss";
import "./assets/scss/custom/fonts/fontsgoogleapis.scss";
import "react-toastify/dist/ReactToastify.css";
import { SettingsProvider } from "./contexts/SettingsContext";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <SettingsProvider>
    <App />
  </SettingsProvider>
  // </StrictMode>,
);

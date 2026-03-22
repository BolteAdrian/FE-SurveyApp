import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SurveyProvider } from "./contexts/SurveyContext.tsx";
import "./i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SurveyProvider>
      <App />
    </SurveyProvider>
  </StrictMode>,
);

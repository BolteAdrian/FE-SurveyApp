import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SurveyProvider } from "./contexts/SurveyContext.tsx";
import "./i18n";
import { AuthProvider } from "./contexts/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <SurveyProvider>
        <App />
      </SurveyProvider>
    </AuthProvider>
  </StrictMode>,
);

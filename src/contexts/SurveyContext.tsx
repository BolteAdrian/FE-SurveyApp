import { createContext, useContext, useState, type ReactNode } from "react";
import type { IQuestion } from "../types/survey";

/**
 * Defines the shape of the Survey context.
 * Holds the list of questions and a setter to update them.
 */
type SurveyContextType = {
  questions: IQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<IQuestion[]>>;
};

/**
 * Create SurveyContext with a null default value.
 * This ensures we can validate usage inside the provider.
 */
const SurveyContext = createContext<SurveyContextType | null>(null);

/**
 * SurveyProvider component
 *
 * Wraps parts of the app that need access to survey questions.
 * Manages questions state and exposes it via context.
 */
export const SurveyProvider = ({ children }: { children: ReactNode }) => {
  // State that stores all survey questions
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  /**
   * Provide questions state and updater function to children components
   */
  return (
    <SurveyContext.Provider value={{ questions, setQuestions }}>
      {children}
    </SurveyContext.Provider>
  );
};

/**
 * Custom hook to access SurveyContext بسهولة
 *
 * Throws an error if used outside of SurveyProvider.
 */
export const useSurveyContext = () => {
  const ctx = useContext(SurveyContext);

  if (!ctx) {
    throw new Error("useSurveyContext must be used within a SurveyProvider");
  }

  return ctx;
};

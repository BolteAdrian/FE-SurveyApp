import { createContext, useContext, useState } from "react";
import type { IQuestion } from "../types/survey";

type SurveyContextType = {
  questions: IQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<IQuestion[]>>;
};

const SurveyContext = createContext<SurveyContextType | null>(null);

export const SurveyProvider = ({ children }: any) => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  return (
    <SurveyContext.Provider value={{ questions, setQuestions }}>
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurveyContext = () => {
  const ctx = useContext(SurveyContext);
  if (!ctx) throw new Error("No SurveyContext");
  return ctx;
};

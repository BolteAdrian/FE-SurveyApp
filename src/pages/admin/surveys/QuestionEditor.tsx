import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useSurveyContext } from "../../../contexts/SurveyContext";
import { QuestionType } from "../../../types/survey";

export default function QuestionEditor() {
  const navigate = useNavigate();

  const [search, setSearch] = useSearchParams();
  const { questions, setQuestions } = useSurveyContext();
  // Stări preluate din URL sau default
  const initialType =
    (search.get("type") as keyof typeof QuestionType) || "CHOICE";
  const [type, setType] = useState<keyof typeof QuestionType>(initialType);
  const surveyId = search.get("surveyId");
  const [title, setTitle] = useState("");
  const [required, setRequired] = useState(false);

  // Stări specifice tipului
  const [options, setOptions] = useState<string[]>(["", ""]); // Minim 2 opțiuni conform design
  const [maxSelections, setMaxSelections] = useState(1);
  const [maxLength, setMaxLength] = useState(1000);

  // Sincronizăm URL-ul când schimbăm tipul din switch
  const handleTypeChange = (newType: keyof typeof QuestionType) => {
    setType(newType);
    setSearch({ type: newType });
  };

  const handleSave = () => {
    if (!title.trim()) return alert("Introdu textul întrebării");

    const newQuestion = {
      type,
      title,
      required,
      order: questions.length,
      surveyId: surveyId!,
      options:
        type === QuestionType.CHOICE
          ? options.map((o) => ({ label: o }))
          : undefined,
    };

    setQuestions((prev) => [...prev, newQuestion]);
    navigate(-1); // Ne întoarcem la editorul de survey
  };

  return (
    <div className="min-h-screen bg-[#111114] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#1e1e24] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* MODAL HEADER (Stil Browser) */}
        <div className="bg-[#111114] p-3 border-b border-gray-800 flex items-center gap-2">
          <div className="flex gap-1.5 ml-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-[10px] font-mono text-gray-600 ml-4 uppercase tracking-widest">
            Modal — Editează întrebare{" "}
            {type === "CHOICE" ? "Multi-choice" : "Text liber"}
          </span>
        </div>

        <div className="p-10 space-y-8">
          <h2 className="text-3xl font-serif text-[#e8e6e1]">
            Editează întrebare
          </h2>

          {/* TYPE SWITCHER */}
          <div className="flex gap-3">
            <button
              onClick={() => handleTypeChange("CHOICE")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-mono transition-all ${
                type === "CHOICE"
                  ? "bg-[#e9c46a] border-[#e9c46a] text-black font-bold"
                  : "bg-[#1A1A22] border-gray-800 text-gray-500 hover:text-gray-300"
              }`}
            >
              <span className="text-[10px]">▣</span> Multi-choice
            </button>
            <button
              onClick={() => handleTypeChange("TEXT")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-mono transition-all ${
                type === "TEXT"
                  ? "bg-[#e9c46a] border-[#e9c46a] text-black font-bold"
                  : "bg-[#1A1A22] border-gray-800 text-gray-500 hover:text-gray-300"
              }`}
            >
              <span className="text-[10px]">≡</span> Text liber
            </button>
          </div>

          {/* QUESTION TEXT */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-gray-600 uppercase tracking-widest ml-1">
              Textul întrebării *
            </label>
            <input
              className="w-full bg-[#1A1A22] border border-gray-800 p-4 rounded-xl outline-none focus:border-gray-600 text-[#e8e6e1] transition-all"
              placeholder="Ex: Ce funcționalitate ai folosit cel mai mult?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* REQUIRED & LIMITS */}
          <div className="flex items-end gap-6">
            <label className="flex items-center gap-3 cursor-pointer group pb-3">
              <input
                type="checkbox"
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
                className="hidden"
              />
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${required ? "bg-green-500 border-green-500" : "bg-[#1A1A22] border-gray-700"}`}
              >
                {required && (
                  <span className="text-black text-xs font-bold">✓</span>
                )}
              </div>
              <span
                className={`text-sm font-mono ${required ? "text-gray-300" : "text-gray-600"}`}
              >
                Required
              </span>
            </label>

            {type === "CHOICE" ? (
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                  Selecții maxime *
                </label>
                <input
                  type="number"
                  className="w-full bg-[#1A1A22] border border-gray-800 p-3 rounded-xl outline-none focus:border-gray-600 font-mono"
                  value={maxSelections}
                  onChange={(e) => setMaxSelections(Number(e.target.value))}
                />
              </div>
            ) : (
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                  Lungime maximă caractere *
                </label>
                <input
                  type="number"
                  className="w-full bg-[#1A1A22] border border-gray-800 p-3 rounded-xl outline-none focus:border-gray-600 font-mono text-sm"
                  value={maxLength}
                  onChange={(e) => setMaxLength(Number(e.target.value))}
                />
              </div>
            )}
          </div>

          {/* OPTIONS SECTION (Doar pt Choice) */}
          {type === "CHOICE" && (
            <div className="space-y-4">
              <label className="text-[10px] font-mono text-gray-600 uppercase tracking-widest ml-1">
                Opțiuni (minim 2)
              </label>
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="flex-1 bg-[#1A1A22] border border-gray-800 p-3 rounded-xl outline-none focus:border-gray-600 text-sm"
                    placeholder={`Opțiunea ${i + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const updated = [...options];
                      updated[i] = e.target.value;
                      setOptions(updated);
                    }}
                  />
                  <button
                    onClick={() =>
                      setOptions(options.filter((_, idx) => idx !== i))
                    }
                    className="p-3 bg-[#1A1A22] border border-gray-800 rounded-xl hover:text-red-500 transition-colors"
                  >
                    🗑
                  </button>
                </div>
              ))}
              <button
                onClick={() => setOptions((prev) => [...prev, ""])}
                className="text-[10px] font-mono text-gray-500 hover:text-gray-300 uppercase tracking-widest px-1"
              >
                + Adaugă opțiune
              </button>
            </div>
          )}

          {/* FOOTER BUTTONS */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-800/50">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-xl text-xs font-mono font-bold text-gray-500 hover:bg-gray-800/50 transition-all"
            >
              Anulează
            </button>
            <button
              onClick={handleSave}
              className="bg-[#e9c46a] text-[#111114] px-8 py-2 rounded-xl text-xs font-mono font-bold hover:bg-[#dfb755] transition-all shadow-lg shadow-yellow-900/10"
            >
              Salvează
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

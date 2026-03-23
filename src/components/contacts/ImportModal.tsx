import { useState, useRef } from "react";
import Papa from "papaparse";

import { useTranslation } from "react-i18next";
import { FileUp, Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { adminApi } from "../../api/adminApi";

interface ImportModalProps {
  listId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface IContactImport {
  email: string;
  name?: string;
}

interface IValidationError {
  row: number;
  email: string;
  message: string;
}

export default function ImportModal({
  listId,
  onClose,
  onSuccess,
}: ImportModalProps) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<IContactImport[] | null>(null);
  const [errors, setErrors] = useState<IValidationError[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setErrors([]);
      setPreviewData(null);
      parseCSV(file);
    }
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[];
        const valid: IContactImport[] = [];
        const invalid: IValidationError[] = [];

        data.forEach((row, index) => {
          const email = row.email?.trim().toLowerCase();
          const name = row.name?.trim();

          if (!email || !emailRegex.test(email)) {
            invalid.push({
              row: index + 2,
              email: email || "N/A",
              message: t("CONTACTS.INVALID_FORMAT"),
            });
          } else {
            valid.push({ email, name });
          }
        });

        setPreviewData(valid);
        setErrors(invalid);
      },
    });
  };

  const handleImport = async () => {
    if (!previewData || previewData.length === 0) return;

    setIsUploading(true);
    try {
      await adminApi.importContacts(listId!, { contacts: previewData });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-[#111114] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 space-y-6">
          {/* HEADER */}
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#e8e6e1] tracking-tight">
              {t("CONTACTS.IMPORT_TITLE", "Importă contacte")}
            </h2>
            <p className="text-sm text-gray-500 font-mono">
              {t(
                "CONTACTS.CSV_REQUIREMENT",
                "Fișierul CSV trebuie să aibă coloanele",
              )}
              <span className="bg-[#1e1e24] text-green-400 px-2 py-0.5 rounded ml-2 mx-1">
                {t("CONTACTS.EMAIL_COLUMN", "email")}
              </span>
              {t("CONTACTS.AND", "și")}
              <span className="bg-[#1e1e24] text-[#55d6a0] px-2 py-0.5 rounded ml-2">
                {t("CONTACTS.NAME_COLUMN", "email")}
              </span>
              <span className="ml-2 text-gray-600">
                {" "}
                {t("CONTACTS.OPTIONAL_NAME", "nume opțional")}.
              </span>
            </p>
          </div>

          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          {/* DROPZONE / PREVIEW AREA */}
          {!previewData ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-gray-800 rounded-2xl p-16 flex flex-col items-center justify-center gap-4 bg-[#0a0a0b] hover:border-gray-600 transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 bg-[#1A1A22] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileUp size={32} className="text-gray-500" />
              </div>
              <p className="text-gray-500 font-mono text-xs text-center">
                {t("CONTACTS.DROPZONE", "Trage fișierul CSV aici sau")}{" "}
                <span className="text-[#e9c46a]">
                  {t("CONTACTS.CHOOSE", "alege fișier")}
                </span>
                <br />
                <span className="text-gray-700 mt-2 block">
                  {t("CONTACTS.MAX_ROWS", "Max. 10.000 rânduri")}
                </span>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* SUCCESS PREVIEW */}
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-green-500" />
                <p className="text-xs font-mono text-green-500/80">
                  {previewData.length}{" "}
                  {t("CONTACTS.VALID_CONTACTS", "contacte gata de import")}
                </p>
              </div>

              {/* ERROR REPORTING */}
              {errors.length > 0 && (
                <div className="max-h-40 overflow-y-auto space-y-2 border border-red-500/20 rounded-xl p-3 bg-red-500/5">
                  <div className="flex items-center gap-2 text-red-400 mb-2">
                    <AlertCircle size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {t("CONTACTS.INVALID_EMAILS", "Emailuri invalide")}
                    </span>
                  </div>
                  {errors.map((err, i) => (
                    <div
                      key={i}
                      className="text-[11px] font-mono text-red-400/70 flex justify-between border-b border-red-500/10 pb-1"
                    >
                      <span>
                        {t("CONTACTS.ROW", "Rând")} {err.row}: {err.email}
                      </span>
                      <span>{err.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* INFO BOX */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 flex gap-4">
            <div className="bg-blue-500/10 p-2 rounded-lg h-fit">
              <Info size={16} className="text-blue-400" />
            </div>
            <p className="text-[12px] text-blue-400/80 leading-relaxed font-mono">
              {t(
                "CONTACTS.IMPORT_INFO",
                "Adresele duplicate (deja existente în listă) vor fi ignorate automat. Adresele invalide vor fi afișate pentru review înainte de import.",
              )}
            </p>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold text-gray-500 hover:bg-[#1A1A22] transition-all"
            >
              {t("CONTACTS.CANCEL", "Anulează")}
            </button>
            <button
              disabled={!previewData || previewData.length === 0 || isUploading}
              onClick={handleImport}
              className="px-8 py-2.5 bg-[#e9c46a] text-[#111114] rounded-xl text-xs font-bold hover:bg-[#dfb755] disabled:opacity-30 disabled:grayscale transition-all"
            >
              {isUploading
                ? t("CONTACTS.IMPORTING", "Se importă...")
                : t("CONTACTS.IMPORT_ACTION", "Importă")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

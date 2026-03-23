import { useState, useRef } from "react";
import Papa from "papaparse";
import { adminApi } from "../../api/adminApi";
import { useTranslation } from "react-i18next";

interface ImportModalrops {
  listId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ImportModal({
  listId,
  onClose,
  onSuccess,
}: ImportModalrops) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    setIsUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          await adminApi.importContacts(listId!, { contacts: results.data });
          onSuccess();
          onClose();
        } catch (err) {
          alert(t("CONTACTS.IMPORT_ERROR"));
        } finally {
          setIsUploading(false);
        }
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-[#1e1e24] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-10 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-[#e8e6e1]">
              {t("CONTACTS.IMPORT_TITLE")}
            </h2>
            <p className="text-sm text-gray-500">
              {t("CONTACTS.IMPORT_DESCRIPTION")}{" "}
              <code className="bg-[#111114] text-green-500 px-1 rounded">
                {t("CONTACTS.EMAIL_COLUMN")}
              </code>{" "}
              {t("CONTACTS.AND")}{" "}
              <code className="bg-[#111114] text-green-500 px-1 rounded">
                {t("CONTACTS.NAME_COLUMN")}
              </code>{" "}
              {t("CONTACTS.COLUMNS")}
            </p>
          </div>

          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 bg-[#111114]/50 hover:border-gray-600 transition-all cursor-pointer group ${
              isUploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <span className="text-4xl group-hover:scale-110 transition-transform">
              📂
            </span>
            <p className="text-gray-500 font-mono text-xs text-center leading-relaxed">
              {isUploading ? t("CONTACTS.PROCESSING") : t("CONTACTS.DROPZONE")}
            </p>
          </div>

          {/* INFO BOX */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex gap-4">
            <span className="text-blue-400">ℹ️</span>
            <p className="text-[11px] text-blue-400/80 leading-relaxed font-mono">
              {t("CONTACTS.IMPORT_INFO")}
            </p>
          </div>

          {/* INSTRUCTIONS */}
          <div className="space-y-2 pt-4 border-t border-gray-800/50">
            {[
              {
                label: t("CONTACTS.COLUMNS_LABEL"),
                detail: t("CONTACTS.COLUMNS_DETAIL"),
              },
              {
                label: t("CONTACTS.INVALID_EMAILS_LABEL"),
                detail: t("CONTACTS.INVALID_EMAILS_DETAIL"),
              },
              {
                label: t("CONTACTS.DUPLICATES_LABEL"),
                detail: t("CONTACTS.DUPLICATES_DETAIL"),
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-2 text-[10px] font-mono">
                <span className="text-green-500">▶</span>
                <span className="text-gray-500">{item.label}</span>
                <span className="text-gray-400 italic">{item.detail}</span>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-xs font-mono font-bold text-gray-500 hover:text-gray-300"
            >
              {t("CONTACTS.CANCEL")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

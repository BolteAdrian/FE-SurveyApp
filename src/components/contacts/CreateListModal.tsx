import { useState } from "react";
import { adminApi } from "../../api/adminApi";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateListModal({ isOpen, onClose, onSuccess }: Props) {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!name.trim() || !user?.id) return;

    setLoading(true);
    try {
      await adminApi.createEmailList({
        name: name.trim(),
        ownerId: user.id,
      });

      setName("");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to create list:", err);
      alert(t("CONTACTS.CREATE_ERROR"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="w-full max-w-md bg-[#1e1e24] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-[#e8e6e1]">
              {t("CONTACTS.LIST_NAME")}
            </h2>
            <p className="text-xs text-gray-500 font-mono italic">
              {t("CONTACTS.LIST_NAME_HINT")}
            </p>
          </div>

          <input
            autoFocus
            className="w-full bg-[#1A1A22] border border-gray-800 p-4 rounded-xl outline-none focus:border-gray-500 text-[#e8e6e1] transition-all placeholder:text-gray-700"
            placeholder={t("CONTACTS.LIST_NAME_PLACEHOLDER")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            disabled={loading}
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 rounded-xl text-xs font-mono text-gray-500 hover:text-gray-300 transition-all disabled:opacity-30"
            >
              {t("CONTACTS.CANCEL")}
            </button>
            <button
              onClick={handleCreate}
              disabled={loading || !name.trim()}
              className="bg-[#e9c46a] text-[#111114] px-8 py-2 rounded-xl text-xs font-mono font-bold hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(233,196,106,0.15)]"
            >
              {loading ? t("CONTACTS.CREATING") : t("CONTACTS.CREATE_LIST")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

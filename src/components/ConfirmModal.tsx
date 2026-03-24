import { useTranslation } from "react-i18next";

type ConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#1e1e24] p-6 rounded-xl w-[90%] max-w-sm shadow-lg text-white">
        {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
          >
            {t("SURVEY.CANCEL")}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
          >
            {t("SURVEY.CONFIRM")}
          </button>
        </div>
      </div>
    </div>
  );
}

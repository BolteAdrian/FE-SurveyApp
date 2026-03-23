import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImportModal from "../../../components/contacts/ImportModal";
import { adminApi } from "../../../api/adminApi";
import { useAuth } from "../../../contexts/AuthContext";
import type { IEmailList } from "../../../types/emailList";
import { useTranslation } from "react-i18next";
import { FileUp, Trash2 } from "lucide-react";

export default function ListsPage() {
  const [lists, setLists] = useState<IEmailList[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (user?.id) fetchLists();
  }, [user?.id]);

  const fetchLists = async () => {
    try {
      const data = await adminApi.getEmailLists(user!.id);
      setLists(data);
    } catch (err) {
      console.error(t("CONTACTS.FAILED_FETCH_LISTS"), err);
    }
  };

  const openImport = (id: string) => {
    setSelectedListId(id);
    setIsImportModalOpen(true);
  };

  const deleteList = async (id: string) => {
    if (!confirm(t("CONTACTS.DELETE_CONFIRM_MESSAGE"))) return;
    try {
      await adminApi.deleteEmailList(id);
      setLists((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      alert(t("CONTACTS.DELETE_ERROR"));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-[#0a0a0b] min-h-screen">
      {lists.length === 0 ? (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-800 rounded-3xl bg-[#111114]">
          <h3 className="text-[#e8e6e1] font-serif">
            {t("CONTACTS.EMPTY_TITLE")}
          </h3>
        </div>
      ) : (
        <div className="space-y-4">
          {lists.map((l) => (
            <div
              key={l.id}
              className="bg-[#111114] border border-gray-800/60 rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:justify-between md:items-center hover:border-gray-700 transition-all gap-4"
            >
              {/* LEFT SIDE: INFO */}
              <div className="space-y-2">
                <h2 className="text-lg md:text-xl font-bold text-[#e8e6e1] tracking-tight">
                  {l.name}
                </h2>
                <div className="flex items-center gap-2 text-[12px] font-mono text-gray-600">
                  <span>
                    {l._count?.emailContacts || 0}{" "}
                    {t("CONTACTS.COUNT_LABEL", "contacte")}
                  </span>
                  <span className="text-gray-800">•</span>
                  <span>
                    {t("CONTACTS.CREATED_AT_LABEL", "creată")}{" "}
                    {new Date(l.createdAt).toLocaleDateString("ro-RO", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>

              {/* RIGHT SIDE: ACTIONS */}
              <div className="flex items-center gap-2">
                <Link
                  to={`/admin/contacts/${l.id}`}
                  className="px-4 py-2 bg-[#1A1A22] border border-gray-800 text-[#e8e6e1] rounded-lg text-xs font-bold hover:bg-gray-800 transition-all"
                >
                  {t("CONTACTS.VIEW", "Vizualizează")}
                </Link>

                <button
                  onClick={() => openImport(l.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1A1A22] border border-gray-800 text-[#e8e6e1] rounded-lg text-xs font-bold hover:border-gray-600 transition-all"
                >
                  <FileUp size={14} className="text-blue-400" />
                  {t("CONTACTS.IMPORT_CSV", "Importă CSV")}
                </button>

                <button
                  onClick={() => deleteList(l.id)}
                  className="p-2 bg-[#1A1A22] border border-gray-800 text-gray-500 rounded-lg hover:text-red-500 hover:border-red-500/30 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isImportModalOpen && (
        <ImportModal
          listId={selectedListId}
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={fetchLists}
        />
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImportModal from "../../../components/contacts/ImportModal";
import { adminApi } from "../../../api/adminApi";
import { useAuth } from "../../../contexts/AuthContext";
import type { IEmailList } from "../../../types/emailList";
import { useTranslation } from "react-i18next";

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
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* EMPTY STATE */}
      {lists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-gray-800 rounded-3xl bg-[#1e1e24]/30">
          <div className="w-16 h-16 bg-[#111114] rounded-full flex items-center justify-center mb-6 border border-gray-800">
            <span className="text-2xl">📬</span>
          </div>
          <h3 className="text-xl font-serif text-[#e8e6e1] mb-2">
            {t("CONTACTS.EMPTY_TITLE")}
          </h3>
          <p className="text-sm text-gray-500 font-mono max-w-sm mb-8">
            {t("CONTACTS.EMPTY_DESCRIPTION")}
          </p>
        </div>
      ) : (
        /* LIST GRID/STACK */
        <div className="space-y-4">
          {lists.map((l) => (
            <div
              key={l.id}
              className="bg-[#1e1e24] border border-gray-800 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row md:justify-between md:items-center hover:border-gray-700 transition-all group gap-4 md:gap-0"
            >
              {/* LEFT SIDE: INFO */}
              <div className="space-y-1">
                <h2 className="text-lg md:text-xl font-semibold text-[#e8e6e1] tracking-tight group-hover:text-white transition-colors">
                  {l.name}
                </h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] md:text-[11px] font-mono text-gray-500 uppercase tracking-wider">
                  <span className="text-green-500/80">
                    {t("CONTACTS.CONTACTS_COUNT", {
                      count: l._count?.emailContacts || 0,
                    })}
                  </span>
                  <span className="hidden md:inline text-gray-800">•</span>
                  <span>
                    {t("CONTACTS.CREATED_AT", {
                      date: new Date(l.createdAt).toLocaleDateString("ro-RO"),
                    })}
                  </span>
                </div>
              </div>

              {/* RIGHT SIDE: ACTIONS */}
              <div className="flex items-center gap-2 md:gap-3 font-mono">
                <Link
                  to={`/admin/contacts/${l.id}`}
                  className="flex-1 md:flex-none text-center px-3 md:px-5 py-2 bg-[#111114] border border-gray-800 text-gray-400 rounded-xl text-[10px] md:text-xs hover:text-white transition-all shadow-sm"
                >
                  {t("CONTACTS.VIEW")}
                </Link>
                <button
                  onClick={() => openImport(l.id)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-5 py-2 bg-[#111114] border border-gray-800 text-gray-400 rounded-xl text-[10px] md:text-xs hover:border-blue-500/50 hover:text-blue-400 transition-all"
                >
                  <span className="hidden sm:inline">
                    {t("CONTACTS.IMPORT_CSV")}
                  </span>
                  <span className="sm:hidden">
                    {t("CONTACTS.CSV")}
                  </span>
                </button>
                <button
                  onClick={() => deleteList(l.id)}
                  className="p-2 bg-[#111114] border border-gray-800 text-gray-600 rounded-xl hover:text-red-500 hover:border-red-500/30 transition-all"
                >
                  <span className="text-sm">🗑</span>
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
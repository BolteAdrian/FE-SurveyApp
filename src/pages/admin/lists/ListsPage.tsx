import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import ImportModal from "../../../components/contacts/ImportModal";
import { adminApi } from "../../../api/adminApi";
import { useAuth } from "../../../contexts/AuthContext";
import type { IEmailList } from "../../../types/emailList";
import { useTranslation } from "react-i18next";
import { FileUp, Trash2, Search } from "lucide-react";
import { toast } from "react-toastify";
import { ConfirmModal } from "../../../components/ConfirmModal";

export default function ListsPage() {
  const [lists, setLists] = useState<IEmailList[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [listToDelete, setListToDelete] = useState<string | null>(null);

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

  const filteredLists = useMemo(() => {
    return lists.filter((l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [lists, searchTerm]);

  const openImport = (id: string) => {
    setSelectedListId(id);
    setIsImportModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setListToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!listToDelete) return;
    try {
      await adminApi.deleteEmailList(listToDelete);

      setLists((prev) => prev.filter((l) => l.id !== listToDelete));
      toast.success(t("CONTACTS.DELETE_SUCCESS_LIST") || "List deleted");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || t("CONTACTS.DELETE_ERROR");
      toast.error(errorMessage);
    } finally {
      setIsDeleteModalOpen(false);
      setListToDelete(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen">
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={t("CONTACTS.DELETE_LIST_TITLE") || "Delete List"}
        message={
          t("CONTACTS.DELETE_LIST_CONFIRM_MESSAGE") ||
          "Are you sure you want to delete this entire list?"
        }
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      {/* HEADER & SEARCHBAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-serif text-[#e8e6e1]">
          {t("CONTACTS.MY_LISTS") || "My Contact Lists"}
        </h1>

        <div className="relative w-full md:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
            size={14}
          />
          <input
            className="w-full bg-[#111114] border border-gray-800 px-10 py-2.5 rounded-xl text-xs outline-none focus:border-gray-600 text-[#e8e6e1] transition-all"
            placeholder={t("CONTACTS.SEARCH_LISTS") || "Search lists..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredLists.length === 0 ? (
        <div className="bg-[#1e1e24] flex flex-col items-center justify-center py-20 border border-dashed border-gray-800 rounded-3xl bg-[#111114]">
          <h3 className="text-[#e8e6e1] font-serif">
            {searchTerm ? t("CONTACTS.NO_RESULTS") : t("CONTACTS.EMPTY_TITLE")}
          </h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLists.map((l) => (
            <div
              key={l.id}
              className="bg-[#1e1e24] border border-gray-800/60 rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:justify-between md:items-center hover:border-gray-700 transition-all gap-4"
            >
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
                  onClick={() => openDeleteModal(l.id)}
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

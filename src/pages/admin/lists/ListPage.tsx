import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { adminApi } from "../../../api/adminApi";
import type { IEmailList, IEmailContact } from "../../../types/emailList";
import { toast } from "react-toastify";
import { emailRegex } from "../../../utils/helpers";
import { ConfirmModal } from "../../../components/ConfirmModal";

export default function ListDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [list, setList] = useState<IEmailList | null>(null);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const fetchList = useCallback(async () => {
    if (!id) return;
    try {
      setFetching(true);
      const data = await adminApi.getEmailListDetails(id);
      setList(data);
    } catch (err) {
      console.error("Error loading list:", err);
    } finally {
      setFetching(false);
    }
  }, [id]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const filteredContacts = useMemo(() => {
    if (!list?.emailContacts) return [];
    return list.emailContacts.filter(
      (contact) =>
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.name &&
          contact.name.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [list?.emailContacts, searchTerm]);

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const currentItems = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const addContact = async () => {
    if (!id) return;
    if (!emailRegex.test(email))
      return toast.error(t("CONTACTS.INVALID_EMAIL"));

    setLoading(true);
    try {
      const newContact = await adminApi.addContactToList(id, { email, name });
      setList((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          emailContacts: [newContact, ...(prev.emailContacts || [])],
        };
      });
      setEmail("");
      setName("");
      toast.success(t("CONTACTS.ADD_SUCCESS"));
    } catch (err) {
      console.error("Error adding contact:", err);
      toast.error(t("EMAIL_LIST.ADD_FAILED"));
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (contactId: string) => {
    setContactToDelete(contactId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!id || !contactToDelete) return;
    try {
      await adminApi.deleteContactFromList(id, contactToDelete);

      setList((prev: any) => ({
        ...prev,
        emailContacts: prev.emailContacts.filter(
          (c: any) => c.id !== contactToDelete,
        ),
      }));

      toast.success(t("CONTACTS.DELETE_SUCCESS") || "Contact deleted");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || t("EMAIL_LIST.CONTACT_DELETE_FAILED");
      toast.error(errorMessage);
    } finally {
      setIsModalOpen(false);
      setContactToDelete(null);
    }
  };

  if (fetching)
    return (
      <div className="p-10 text-gray-500 font-mono">
        {t("EMAIL_LIST.LOADING")}
      </div>
    );
  if (!list)
    return (
      <div className="p-10 text-gray-500 font-mono">
        {t("EMAIL_LIST.NOT_FOUND")}
      </div>
    );

  return (
    <div className="min-h-screen text-[#e8e6e1] flex flex-col lg:flex-row gap-8 p-6">
      {/* CONFIRM MODAL */}
      <ConfirmModal
        isOpen={isModalOpen}
        title={t("CONTACTS.DELETE_TITLE") || "Delete Contact"}
        message={t("CONTACTS.DELETE_CONFIRM")}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />

      {/* LEFT PANEL */}
      <div className="w-full lg:w-80 space-y-6">
        <button
          onClick={() => navigate("/admin/contacts")}
          className="text-xs font-mono text-gray-500 hover:text-white transition-colors flex items-center gap-2"
        >
          ← {t("EMAIL_LIST.BACK_TO_LISTS")}
        </button>

        <div className="space-y-1">
          <h2 className="text-3xl font-serif text-[#e8e6e1]">{list.name}</h2>
        </div>

        {/* ADD CONTACT FORM */}
        <div className="bg-[#1e1e24] border border-gray-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-3">
            {t("CONTACTS.ADD_CONTACT")}
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-600 uppercase">
                {t("CONTACTS.EMAIL")} *
              </label>
              <input
                className="w-full bg-[#1A1A22] border border-gray-800 p-3 rounded-xl outline-none focus:border-gray-600 text-sm transition-all"
                placeholder={t("CONTACTS.EMAIL_PLACEHOLDER")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-600 uppercase">
                {t("CONTACTS.NAME")} ({t("CONTACTS.OPTIONAL")})
              </label>
              <input
                className="w-full bg-[#1A1A22] border border-gray-800 p-3 rounded-xl outline-none focus:border-gray-600 text-sm transition-all"
                placeholder={t("CONTACTS.NAME_PLACEHOLDER")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <button
              onClick={addContact}
              disabled={loading || !email}
              className="w-full bg-[#1A1A22] border border-green-500/30 text-green-400 py-3 rounded-xl font-mono text-xs font-bold hover:bg-green-500/10 transition-all disabled:opacity-30"
            >
              {loading
                ? t("CONTACTS.ADDING")
                : `+ ${t("CONTACTS.ADD_TO_LIST")}`}
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="p-6 bg-[#1A1A22]/50 border border-gray-800 rounded-2xl space-y-4 font-mono">
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-600">{t("CONTACTS.TOTAL")}:</span>
            <span className="text-[#e8e6e1]">
              {list.emailContacts?.length || 0}
            </span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-600">{t("EMAIL_LIST.CREATED_AT")}:</span>
            <span className="text-[#e8e6e1]">
              {list.createdAt
                ? new Date(list.createdAt).toLocaleDateString()
                : "-"}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: CONTACTS TABLE */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-gray-500 font-mono text-sm uppercase tracking-tighter">
            {t("CONTACTS.LIST_MEMBERS")}{" "}
            <span className="text-gray-700">
              ({list.emailContacts?.length || 0})
            </span>
          </h2>

          {/* SEARCH INPUT */}
          <input
            className="bg-[#1e1e24] border border-gray-800 px-4 py-2 rounded-xl text-xs outline-none focus:border-gray-600 w-full md:w-64"
            placeholder={
              t("CONTACTS.SEARCH_PLACEHOLDER") || "Search by name or email..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-[#1e1e24] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111114] border-b border-gray-800 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  <th className="px-6 py-4 font-medium">
                    {t("CONTACTS.NAME")}
                  </th>
                  <th className="px-6 py-4 font-medium">
                    {t("CONTACTS.EMAIL")}
                  </th>
                  <th className="px-6 py-4 font-medium">
                    {t("EMAIL_LIST.DATE_ADDED")}
                  </th>
                  <th className="px-6 py-4 font-medium text-right">
                    {t("CONTACTS.ACTIONS")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {currentItems.map((c: IEmailContact) => (
                  <tr
                    key={c.id}
                    className="hover:bg-[#1A1A22]/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span
                        className={
                          c.name
                            ? "text-[#e8e6e1]"
                            : "text-gray-700 italic text-xs"
                        }
                      >
                        {c.name || t("CONTACTS.NO_NAME")}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-green-500/80">
                      {c.email}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openDeleteModal(c.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-600 hover:text-red-500 transition-all"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredContacts.length === 0 && (
            <div className="py-20 text-center text-gray-600 font-mono text-sm">
              {searchTerm ? t("CONTACTS.NO_RESULTS") : t("CONTACTS.EMPTY_LIST")}
            </div>
          )}
        </div>

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6 font-mono text-xs">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-800 rounded-lg disabled:opacity-30 hover:bg-gray-800"
            >
              {t("PAGINATION.PREVIOUS") || "Prev"}
            </button>
            <span className="text-gray-500">
              {t("PAGINATION.PAGE") || "Page"} {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-800 rounded-lg disabled:opacity-30 hover:bg-gray-800"
            >
              {t("PAGINATION.NEXT") || "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

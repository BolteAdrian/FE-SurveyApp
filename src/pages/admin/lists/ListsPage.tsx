import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImportModal from "../../../components/contacts/ImportModal";


export default function ListsPage() {
  const [lists, setLists] = useState<any[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    // Înlocuiește cu adminApi.getLists() dacă ai funcția definită
    const res = await fetch("/api/lists");
    const data = await res.json();
    setLists(data);
  };

  const openImport = (id: string) => {
    setSelectedListId(id);
    setIsImportModalOpen(true);
  };

  const deleteList = async (id: string) => {
    if (!confirm("Sigur vrei să ștergi această listă?")) return;
    await fetch(`/api/lists/${id}`, { method: "DELETE" });
    setLists((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-10">
        <p className="text-gray-500 font-mono text-[11px] mb-2 uppercase tracking-[0.2em]">
          Managementul listelor de adrese de email. O listă poate fi reutilizată în mai multe sondaje.
        </p>
      </div>

      <div className="space-y-4">
        {lists.map((l) => (
          <div
            key={l.id}
            className="bg-[#1e1e24] border border-gray-800 rounded-xl p-6 flex justify-between items-center hover:border-gray-700 transition-all group"
          >
            {/* INFO */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[#e8e6e1] tracking-tight group-hover:text-white transition-colors">
                {l.name}
              </h2>
              <div className="flex items-center gap-3 text-[11px] font-mono text-gray-500">
                <span>{l.emailContacts?.length || 0} contacte</span>
                <span className="text-gray-800">•</span>
                <span>
                  creat {l.createdAt ? new Date(l.createdAt).toLocaleDateString("ro-RO") : "recent"}
                </span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3 font-mono">
              <Link
                to={`/admin/lists/${l.id}`}
                className="px-4 py-2 bg-[#111114] border border-gray-800 text-gray-400 rounded-lg text-xs hover:text-white transition-all shadow-sm"
              >
                Vizualizează
              </Link>

              <button
                onClick={() => openImport(l.id)}
                className="flex items-center gap-2 px-4 py-2 bg-[#111114] border border-gray-800 text-gray-400 rounded-lg text-xs hover:border-blue-500/50 hover:text-blue-400 transition-all"
              >
                <span>📬</span> Importă CSV
              </button>

              <button
                onClick={() => deleteList(l.id)}
                className="p-2 bg-[#111114] border border-gray-800 text-gray-600 rounded-lg hover:text-red-500 hover:border-red-500/30 transition-all"
              >
                🗑
              </button>
            </div>
          </div>
        ))}

        {lists.length === 0 && (
          <div className="py-20 text-center border border-dashed border-gray-800 rounded-xl text-gray-600 font-mono text-sm">
            Nu există liste create. Folosește butonul "+ Listă nouă" de sus.
          </div>
        )}
      </div>

      {/* MODAL IMPORT */}
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
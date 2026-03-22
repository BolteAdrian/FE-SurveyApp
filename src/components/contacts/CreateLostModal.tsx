import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateListModal({ isOpen, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        setName("");
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="w-full max-w-md bg-[#1e1e24] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* MODAL HEADER (Browser Style) */}
        <div className="bg-[#111114] p-3 border-b border-gray-800 flex items-center gap-2">
          <div className="flex gap-1.5 ml-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-[10px] font-mono text-gray-600 ml-4 uppercase tracking-widest">
            Nouă Listă de Contacte
          </span>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-[#e8e6e1]">Nume Listă</h2>
            <p className="text-xs text-gray-500 font-mono italic">
              Ex: "Clienți Fideli", "Newsletter Martie"
            </p>
          </div>

          <input
            autoFocus
            className="w-full bg-[#1A1A22] border border-gray-800 p-4 rounded-xl outline-none focus:border-gray-600 text-[#e8e6e1] transition-all"
            placeholder="Introduceți numele listei..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-xs font-mono text-gray-500 hover:text-gray-300 transition-all"
            >
              Anulează
            </button>
            <button
              onClick={handleCreate}
              disabled={loading || !name.trim()}
              className="bg-[#e9c46a] text-[#111114] px-8 py-2 rounded-xl text-xs font-mono font-bold hover:brightness-110 disabled:opacity-50 transition-all"
            >
              {loading ? "Se creează..." : "Creează Listă"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
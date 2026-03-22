import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ListDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchList();
  }, [id]);

  const fetchList = async () => {
    try {
      const res = await fetch(`/api/lists/${id}`);
      const data = await res.json();
      setList(data);
    } catch (err) {
      console.error("Eroare la încărcare:", err);
    }
  };

  const addContact = async () => {
    if (!email.includes("@")) return alert("Introdu un email valid");
    setLoading(true);
    try {
      const res = await fetch(`/api/lists/${id}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const newContact = await res.json();
      setList((prev: any) => ({
        ...prev,
        emailContacts: [newContact, ...prev.emailContacts],
      }));
      setEmail("");
      setName("");
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (cid: string) => {
    if (!confirm("Ștergi acest contact?")) return;
    await fetch(`/api/lists/${id}/contacts/${cid}`, { method: "DELETE" });
    setList((prev: any) => ({
      ...prev,
      emailContacts: prev.emailContacts.filter((c: any) => c.id !== cid),
    }));
  };

  if (!list) return <div className="p-10 text-gray-500 font-mono">Se încarcă...</div>;

  return (
    <div className="min-h-screen text-[#e8e6e1] flex gap-8 p-6">
      
      {/* LEFT PANEL: INFO & ADD */}
      <div className="w-80 space-y-6">
        <button 
          onClick={() => navigate("/admin/contacts")}
          className="text-xs font-mono text-gray-500 hover:text-white transition-colors flex items-center gap-2"
        >
          ← Înapoi la liste
        </button>

        <div className="space-y-1">
          <h2 className="text-3xl font-serif text-[#e8e6e1]">{list.name}</h2>
          <p className="text-[11px] font-mono text-gray-600 uppercase tracking-widest">
            ID: {id?.slice(0, 8)}...
          </p>
        </div>

        <div className="bg-[#1e1e24] border border-gray-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-3">
            Adaugă Contact
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-600 uppercase">Email *</label>
              <input
                className="w-full bg-[#1A1A22] border border-gray-800 p-3 rounded-xl outline-none focus:border-gray-600 text-sm transition-all"
                placeholder="email@exemplu.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-600 uppercase">Nume (opțional)</label>
              <input
                className="w-full bg-[#1A1A22] border border-gray-800 p-3 rounded-xl outline-none focus:border-gray-600 text-sm transition-all"
                placeholder="Numele complet"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <button
              onClick={addContact}
              disabled={loading || !email}
              className="w-full bg-[#1A1A22] border border-green-500/30 text-green-400 py-3 rounded-xl font-mono text-xs font-bold hover:bg-green-500/10 transition-all disabled:opacity-30"
            >
              + Adaugă în listă
            </button>
          </div>
        </div>

        {/* STATS QUICK VIEW */}
        <div className="p-6 bg-[#1A1A22]/50 border border-gray-800 rounded-2xl space-y-4 font-mono">
            <div className="flex justify-between text-[11px]">
                <span className="text-gray-600">Total contacte:</span>
                <span className="text-[#e8e6e1]">{list.emailContacts?.length || 0}</span>
            </div>
            <div className="flex justify-between text-[11px]">
                <span className="text-gray-600">Creată la:</span>
                <span className="text-[#e8e6e1]">
                    {list.createdAt ? new Date(list.createdAt).toLocaleDateString() : "-"}
                </span>
            </div>
        </div>
      </div>

      {/* RIGHT PANEL: CONTACTS TABLE */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-gray-500 font-mono text-sm uppercase tracking-tighter">
                Membri listă <span className="text-gray-700">({list.emailContacts?.length || 0})</span>
            </h2>
        </div>

        <div className="bg-[#1e1e24] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111114] border-b border-gray-800 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                <th className="px-6 py-4 font-medium">Nume</th>
                <th className="px-6 py-4 font-medium">Adresă Email</th>
                <th className="px-6 py-4 font-medium">Dată adăugare</th>
                <th className="px-6 py-4 font-medium text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {list.emailContacts.map((c: any) => (
                <tr key={c.id} className="hover:bg-[#1A1A22]/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className={c.name ? "text-[#e8e6e1]" : "text-gray-700 italic text-xs"}>
                      {c.name || "Fără nume"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-green-500/80">
                    {c.email}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteContact(c.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-600 hover:text-red-500 transition-all"
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {list.emailContacts.length === 0 && (
            <div className="py-20 text-center text-gray-600 font-mono text-sm">
              Lista este goală. Adaugă contacte manual sau folosește importul CSV.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
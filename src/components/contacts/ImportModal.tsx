export default function ImportModal({ listId, onClose, onSuccess }: any) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-[#1e1e24] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* MODAL HEADER */}
        <div className="bg-[#111114] p-3 border-b border-gray-800 flex items-center gap-2">
          <div className="flex gap-1.5 ml-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-[10px] font-mono text-gray-600 ml-4 uppercase tracking-widest">
            Modal — Import CSV
          </span>
        </div>

        <div className="p-10 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-[#e8e6e1]">Importă contacte</h2>
            <p className="text-sm text-gray-500">
              Fișierul CSV trebuie să aibă coloanele <code className="bg-[#111114] text-green-500 px-1 rounded">email</code> și <code className="bg-[#111114] text-green-500 px-1 rounded">name</code> (name opțional).
            </p>
          </div>

          {/* DRAG AND DROP AREA */}
          <div className="border-2 border-dashed border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 bg-[#111114]/50 hover:border-gray-600 transition-all cursor-pointer group">
            <span className="text-4xl group-hover:scale-110 transition-transform">📂</span>
            <p className="text-gray-500 font-mono text-xs text-center leading-relaxed">
              Trage fișierul CSV aici sau <span className="text-[#e9c46a] underline">alege fișier</span>
              <br />
              <span className="opacity-50 italic">Max. 10.000 rânduri</span>
            </p>
          </div>

          {/* INFO BOX */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex gap-4">
            <span className="text-blue-400">ℹ️</span>
            <p className="text-[11px] text-blue-400/80 leading-relaxed font-mono">
              Adresele duplicate (deja existente în listă) vor fi ignorate automat. Adresele invalide vor fi afișate pentru review înainte de import.
            </p>
          </div>

          {/* INSTRUCTIONS FOOTER */}
          <div className="space-y-2 pt-4 border-t border-gray-800/50">
            {[
              { label: "Coloane acceptate:", detail: "email (obligatoriu), name (opțional)" },
              { label: "Emailuri invalide:", detail: "sunt raportate (rând + mesaj) înainte de confirmare" },
              { label: "Duplicate în aceeași listă:", detail: "sunt ignorate silențios" }
            ].map((item, i) => (
              <div key={i} className="flex gap-2 text-[10px] font-mono">
                <span className="text-green-500">▶</span>
                <span className="text-gray-500">{item.label}</span>
                <span className="text-gray-400 italic">{item.detail}</span>
              </div>
            ))}
          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-xs font-mono font-bold text-gray-500 hover:text-gray-300 transition-all"
            >
              Anulează
            </button>
            <button className="bg-[#e9c46a] text-[#111114] px-8 py-2 rounded-xl text-xs font-mono font-bold hover:brightness-110 transition-all">
              Importă
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
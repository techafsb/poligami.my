import { useState } from "react";

type Node = {
  id: string;
  label: string;
  sub?: string;
  group: "entry" | "onboarding" | "registration" | "main" | "explore" | "settings" | "legal";
};

type Edge = {
  from: string;
  to: string;
  label?: string;
};

const NODES: Node[] = [
  // Entry
  { id: "splash", label: "Splash / Opening", sub: "Video animation", group: "entry" },
  { id: "welcome", label: "Welcome", sub: "Log Masuk · Daftar Akaun", group: "entry" },

  // Auth
  { id: "login", label: "Log Masuk", sub: "Emel + kata laluan", group: "onboarding" },

  // Registration
  { id: "pre-reg", label: "Daftar Akaun", sub: "Nama · Emel · No Tel", group: "registration" },
  { id: "email-verify", label: "Sahkan Emel", sub: "Pautan dalam 15 min", group: "registration" },
  { id: "create-profile", label: "Profil Asas", sub: "Gambar · Umur · Peranan · Kata Laluan", group: "registration" },
  { id: "role-status", label: "Peranan & Status", sub: "6 pilihan peranan", group: "registration" },
  { id: "current-marriage", label: "Perkahwinan Semasa", sub: "Maklumat isteri / suami", group: "registration" },
  { id: "select-state", label: "Pilih Negeri", sub: "Dropdown 14 negeri", group: "registration" },
  { id: "legal-checklist", label: "Senarai Semak Undang-undang", sub: "Per negeri, 4 bahagian", group: "registration" },
  { id: "checklist-detail", label: "Detail Seksyen", sub: "Baca → tandakan → unlock", group: "registration" },
  { id: "identity-verify", label: "Pengesahan Identiti (eKYC)", sub: "MyKad depan & belakang", group: "registration" },
  { id: "upload-docs", label: "Muat Naik Dokumen", sub: "Sijil nikah, sokongan", group: "registration" },
  { id: "photo-privacy", label: "Privasi Foto", sub: "Pilihan keterlihatan", group: "registration" },

  // Main tabs
  { id: "feed", label: "Feed", sub: "Post daripada match", group: "main" },
  { id: "explore", label: "Explore", sub: "Swipe kad profil", group: "explore" },
  { id: "trust-gate", label: "Ruang Semak", sub: "Dashboard kepercayaan", group: "main" },
  { id: "chat-inbox", label: "Chat Inbox", sub: "Semua perbualan match", group: "main" },
  { id: "account-settings", label: "Profil / Tetapan", sub: "Akaun & dokumen", group: "main" },

  // Explore sub-flows
  { id: "candidate-profile", label: "Profil Calon", sub: "Lihat maklumat penuh", group: "explore" },
  { id: "match-overlay", label: "Match!", sub: "Kedua-dua suka", group: "explore" },
  { id: "safe-chat", label: "Safe Chat", sub: "Perbualan sepanjang diawal", group: "explore" },
  { id: "photo-consent", label: "Permohonan Foto", sub: "Minta akses gambar", group: "explore" },
  { id: "report-safety", label: "Lapor Keselamatan", sub: "Aduan & pemblokiran", group: "explore" },

  // Verification
  { id: "verification-status", label: "Status Pengesahan", sub: "Jejak eKYC & dokumen", group: "main" },
  { id: "panduan", label: "Panduan", sub: "Garis panduan poligami", group: "main" },

  // Settings screens
  { id: "settings-profil", label: "Maklumat Profil", sub: "Edit nama, bio, pekerjaan", group: "settings" },
  { id: "settings-privasi", label: "Privasi & Keselamatan", sub: "Siapa boleh lihat profil", group: "settings" },
  { id: "settings-dokumen", label: "Dokumen Saya", sub: "Semak semula muat naik", group: "settings" },
  { id: "settings-notif", label: "Notifikasi", sub: "Toggle pemberitahuan", group: "settings" },
  { id: "settings-selamat", label: "Keselamatan Akaun", sub: "Tukar kata laluan", group: "settings" },
  { id: "bantuan", label: "Bantuan", sub: "Soalan lazim", group: "settings" },
  { id: "polisi-privasi", label: "Polisi Privasi", group: "legal" },
  { id: "terma", label: "Terma Penggunaan", group: "legal" },
  { id: "padam-akaun", label: "Padam Akaun", sub: "Taip PADAM untuk sahkan", group: "settings" },
];

const GROUP_COLORS: Record<Node["group"], { bg: string; border: string; text: string; dot: string }> = {
  entry:        { bg: "#0f172a", border: "#334155", text: "#f8fafc", dot: "#94a3b8" },
  onboarding:   { bg: "#1e1b4b", border: "#4338ca", text: "#e0e7ff", dot: "#818cf8" },
  registration: { bg: "#172554", border: "#1d4ed8", text: "#dbeafe", dot: "#60a5fa" },
  main:         { bg: "#052e16", border: "#15803d", text: "#dcfce7", dot: "#4ade80" },
  explore:      { bg: "#431407", border: "#c2410c", text: "#ffedd5", dot: "#fb923c" },
  settings:     { bg: "#1c1917", border: "#57534e", text: "#e7e5e4", dot: "#a8a29e" },
  legal:        { bg: "#1c1917", border: "#44403c", text: "#d6d3d1", dot: "#78716c" },
};

const GROUP_LABELS: Record<Node["group"], string> = {
  entry: "Pembukaan",
  onboarding: "Log Masuk",
  registration: "Pendaftaran",
  main: "Tab Utama",
  explore: "Explore & Chat",
  settings: "Tetapan",
  legal: "Maklumat Undang-undang",
};

const SECTIONS: { group: Node["group"]; ids: string[] }[] = [
  { group: "entry", ids: ["splash", "welcome"] },
  { group: "onboarding", ids: ["login"] },
  {
    group: "registration",
    ids: [
      "pre-reg", "email-verify", "create-profile", "role-status",
      "current-marriage", "select-state", "legal-checklist",
      "checklist-detail", "identity-verify", "upload-docs", "photo-privacy",
    ],
  },
  {
    group: "main",
    ids: ["feed", "trust-gate", "chat-inbox", "account-settings", "verification-status", "panduan"],
  },
  {
    group: "explore",
    ids: ["explore", "candidate-profile", "match-overlay", "safe-chat", "photo-consent", "report-safety"],
  },
  {
    group: "settings",
    ids: ["settings-profil", "settings-privasi", "settings-dokumen", "settings-notif", "settings-selamat", "bantuan", "padam-akaun"],
  },
  { group: "legal", ids: ["polisi-privasi", "terma"] },
];

const FLOWS: { label: string; color: string; edges: [string, string, string?][] }[] = [
  {
    label: "Pembukaan → Log Masuk",
    color: "#818cf8",
    edges: [
      ["splash", "welcome"],
      ["welcome", "login", "Log Masuk"],
    ],
  },
  {
    label: "Pendaftaran Penuh",
    color: "#60a5fa",
    edges: [
      ["welcome", "pre-reg", "Daftar Akaun"],
      ["pre-reg", "email-verify"],
      ["email-verify", "create-profile", "Verified"],
      ["create-profile", "role-status"],
      ["role-status", "current-marriage"],
      ["current-marriage", "select-state"],
      ["select-state", "legal-checklist"],
      ["legal-checklist", "checklist-detail"],
      ["checklist-detail", "identity-verify", "Semua seksyen selesai"],
      ["identity-verify", "upload-docs"],
      ["upload-docs", "photo-privacy"],
      ["photo-privacy", "feed", "Masuk App"],
    ],
  },
  {
    label: "Log Masuk → Feed",
    color: "#4ade80",
    edges: [
      ["login", "feed", "Berjaya"],
    ],
  },
  {
    label: "Explore & Match",
    color: "#fb923c",
    edges: [
      ["explore", "candidate-profile", "Klik profil"],
      ["explore", "match-overlay", "Swipe kanan + match"],
      ["match-overlay", "safe-chat"],
      ["safe-chat", "photo-consent"],
      ["safe-chat", "report-safety"],
    ],
  },
  {
    label: "Ruang Semak",
    color: "#34d399",
    edges: [
      ["trust-gate", "verification-status"],
    ],
  },
  {
    label: "Tetapan Profil",
    color: "#a8a29e",
    edges: [
      ["account-settings", "settings-profil"],
      ["account-settings", "settings-privasi"],
      ["account-settings", "settings-dokumen"],
      ["account-settings", "settings-notif"],
      ["account-settings", "settings-selamat"],
      ["account-settings", "bantuan"],
      ["account-settings", "polisi-privasi"],
      ["account-settings", "terma"],
      ["account-settings", "padam-akaun"],
      ["account-settings", "verification-status"],
      ["account-settings", "panduan"],
    ],
  },
];

function NodeCard({ node, active, onClick }: { node: Node; active: boolean; onClick: () => void }) {
  const c = GROUP_COLORS[node.group];
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? c.border : c.bg,
        border: `1px solid ${active ? "#fff" : c.border}`,
        color: c.text,
        boxShadow: active ? `0 0 0 2px ${c.dot}` : "none",
        transition: "all 0.15s ease",
      }}
      className="rounded-xl px-3 py-2 text-left w-full cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: c.dot }}
        />
        <span className="text-xs font-semibold leading-tight">{node.label}</span>
      </div>
      {node.sub && (
        <p className="text-[10px] mt-0.5 ml-4 opacity-60 leading-tight">{node.sub}</p>
      )}
    </button>
  );
}

export default function FlowDiagram() {
  const [activeFlow, setActiveFlow] = useState<number | null>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const highlightedNodes = activeFlow !== null
    ? new Set(FLOWS[activeFlow].edges.flatMap(([a, b]) => [a, b]))
    : activeNode
    ? new Set(
        FLOWS.flatMap((f) =>
          f.edges.flatMap(([a, b]) =>
            a === activeNode || b === activeNode ? [a, b] : []
          )
        )
      )
    : null;

  const connectedFlows = activeNode
    ? FLOWS.filter((f) => f.edges.some(([a, b]) => a === activeNode || b === activeNode))
    : activeFlow !== null
    ? [FLOWS[activeFlow]]
    : [];

  return (
    <div
      className="min-h-screen w-full overflow-y-auto"
      style={{ background: "#080c14", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-4 flex items-center justify-between"
        style={{ background: "rgba(8,12,20,0.95)", borderBottom: "1px solid #1e293b" }}>
        <div>
          <h1 className="text-white font-bold text-lg tracking-tight">poligami.my</h1>
          <p className="text-slate-400 text-xs mt-0.5">UI/UX Flow Diagram · {NODES.length} skrin · {FLOWS.reduce((a, f) => a + f.edges.length, 0)} sambungan</p>
        </div>
        {(activeFlow !== null || activeNode) && (
          <button
            onClick={() => { setActiveFlow(null); setActiveNode(null); }}
            className="text-xs text-slate-400 border border-slate-700 rounded-lg px-3 py-1.5 hover:text-white hover:border-slate-500 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      <div className="px-4 py-5 space-y-6 max-w-2xl mx-auto">

        {/* Legend */}
        <div>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-2">Kumpulan Skrin</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(GROUP_LABELS) as Node["group"][]).map((g) => (
              <div key={g} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: GROUP_COLORS[g].dot }} />
                <span className="text-[11px] text-slate-400">{GROUP_LABELS[g]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Flow selector */}
        <div>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-2">Aliran Navigasi</p>
          <div className="flex flex-col gap-2">
            {FLOWS.map((flow, i) => (
              <button
                key={i}
                onClick={() => { setActiveFlow(activeFlow === i ? null : i); setActiveNode(null); }}
                className="flex items-center gap-3 text-left rounded-xl px-3 py-2.5 transition-all"
                style={{
                  background: activeFlow === i ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${activeFlow === i ? flow.color : "#1e293b"}`,
                }}
              >
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: flow.color }} />
                <div className="flex-1">
                  <span className="text-sm text-white">{flow.label}</span>
                  <span className="text-slate-500 text-xs ml-2">({flow.edges.length} langkah)</span>
                </div>
                {activeFlow === i && (
                  <span className="text-[10px] rounded-full px-2 py-0.5" style={{ background: flow.color + "33", color: flow.color }}>
                    Aktif
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active flow steps */}
        {activeFlow !== null && (
          <div>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-2">Urutan Langkah</p>
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #1e293b" }}>
              {FLOWS[activeFlow].edges.map(([from, to, lbl], i) => {
                const fromNode = NODES.find((n) => n.id === from)!;
                const toNode = NODES.find((n) => n.id === to)!;
                if (!fromNode || !toNode) return null;
                const fc = GROUP_COLORS[fromNode.group];
                const tc = GROUP_COLORS[toNode.group];
                return (
                  <div key={i} className="flex items-center gap-2 px-3 py-2.5"
                    style={{ borderBottom: i < FLOWS[activeFlow].edges.length - 1 ? "1px solid #1e293b" : "none" }}>
                    <span className="text-slate-600 text-[10px] w-4 text-right flex-shrink-0">{i + 1}</span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md flex-shrink-0"
                      style={{ background: fc.bg, color: fc.text, border: `1px solid ${fc.border}` }}>
                      {fromNode.label}
                    </span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <div className="h-px w-4" style={{ background: FLOWS[activeFlow].color }} />
                      {lbl && <span className="text-[9px] text-slate-500 max-w-[80px] text-center leading-tight">{lbl}</span>}
                      <div className="h-px w-4" style={{ background: FLOWS[activeFlow].color }} />
                      <span style={{ color: FLOWS[activeFlow].color }} className="text-xs">→</span>
                    </div>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md flex-shrink-0"
                      style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}>
                      {toNode.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Screen groups */}
        {SECTIONS.map(({ group, ids }) => {
          const c = GROUP_COLORS[group];
          const nodes = ids.map((id) => NODES.find((n) => n.id === id)!).filter(Boolean);
          return (
            <div key={group}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full" style={{ background: c.dot }} />
                <p className="text-[10px] uppercase tracking-widest" style={{ color: c.dot }}>
                  {GROUP_LABELS[group]}
                </p>
                <span className="text-[10px] text-slate-600">· {nodes.length} skrin</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {nodes.map((node) => {
                  const dimmed = highlightedNodes && !highlightedNodes.has(node.id);
                  return (
                    <div key={node.id} style={{ opacity: dimmed ? 0.25 : 1, transition: "opacity 0.2s" }}>
                      <NodeCard
                        node={node}
                        active={activeNode === node.id || (activeFlow !== null && (highlightedNodes?.has(node.id) ?? false))}
                        onClick={() => {
                          setActiveNode(activeNode === node.id ? null : node.id);
                          setActiveFlow(null);
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Show connections for tapped node */}
              {activeNode && connectedFlows.length > 0 && nodes.some((n) => n.id === activeNode) && (
                <div className="mt-2 rounded-xl px-3 py-2 space-y-1" style={{ background: "#0f172a", border: "1px solid #1e293b" }}>
                  <p className="text-[10px] text-slate-500 mb-1">Disambungkan dalam:</p>
                  {connectedFlows.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: f.color }} />
                      <span className="text-[11px] text-slate-300">{f.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Stats footer */}
        <div className="grid grid-cols-3 gap-3 pt-2 pb-6">
          {[
            { label: "Jumlah Skrin", value: NODES.length },
            { label: "Aliran", value: FLOWS.length },
            { label: "Sambungan", value: FLOWS.reduce((a, f) => a + f.edges.length, 0) },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-3 text-center"
              style={{ background: "#0f172a", border: "1px solid #1e293b" }}>
              <p className="text-white text-2xl font-bold">{s.value}</p>
              <p className="text-slate-500 text-[10px] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";

/* ─────────────────────────────────────────────────────────────
   poligami.my · Design System & UX Documentation
   Standalone file — not part of the main app bundle
───────────────────────────────────────────────────────────── */

const PAGES = [
  { num: "00", title: "Cover & Documentation", desc: "Overview, changelog, file structure" },
  { num: "01", title: "Foundations", desc: "Color, typography, spacing, iconography, grid" },
  { num: "02", title: "Components", desc: "Buttons, inputs, cards, modals, badges, chips" },
  { num: "03", title: "Authentication & Legal", desc: "Log masuk, daftar, terma, polisi privasi" },
  { num: "04", title: "Onboarding", desc: "Pendaftaran, e-KYC, muat naik dokumen, splash" },
  { num: "05", title: "Home & Feed", desc: "Feed post, stories, aktiviti terkini" },
  { num: "06", title: "Discover & Explore", desc: "Swipe kad, filter carian, profil calon" },
  { num: "07", title: "Connections & Matches", desc: "Match overlay, senarai sambungan, status" },
  { num: "08", title: "Chat & Notifications", desc: "Safe chat, inbox, pemberitahuan, media share" },
  { num: "09", title: "Profile & Settings", desc: "Maklumat profil, privasi, dokumen, keselamatan" },
  { num: "10", title: "Safety, Reports & Permissions", desc: "Laporan, blok, aduan, kebenaran foto" },
  { num: "11", title: "Verification & Trust Gate", desc: "eKYC, semak dokumen, status kepercayaan" },
  { num: "12", title: "Complete User Flows", desc: "End-to-end flows dari splash hingga match" },
];

const FOUNDATIONS = [
  {
    title: "Warna",
    items: [
      { label: "Primary", value: "#1a1a2e", swatch: "#1a1a2e" },
      { label: "Accent Gold", value: "#c9a84c", swatch: "#c9a84c" },
      { label: "Surface", value: "#ffffff", swatch: "#ffffff" },
      { label: "Muted", value: "#6b7280", swatch: "#6b7280" },
      { label: "Success", value: "#16a34a", swatch: "#16a34a" },
      { label: "Warning", value: "#d97706", swatch: "#d97706" },
      { label: "Error", value: "#dc2626", swatch: "#dc2626" },
      { label: "Background", value: "#f9fafb", swatch: "#f9fafb" },
    ],
  },
  {
    title: "Tipografi",
    items: [
      { label: "Display", value: "Playfair Display · 700 · 32–48px", swatch: null },
      { label: "Heading 1", value: "Playfair Display · 600 · 24px", swatch: null },
      { label: "Heading 2", value: "Inter · 600 · 18px", swatch: null },
      { label: "Body", value: "Inter · 400 · 14–16px", swatch: null },
      { label: "Caption", value: "Inter · 400 · 12px", swatch: null },
      { label: "Label", value: "Inter · 500 · 11px · uppercase", swatch: null },
    ],
  },
  {
    title: "Spacing",
    items: [
      { label: "4px", value: "xs — padding dalam chip, badge", swatch: null },
      { label: "8px", value: "sm — padding dalam button kecil", swatch: null },
      { label: "12px", value: "md — gap antara elemen", swatch: null },
      { label: "16px", value: "base — padding standard", swatch: null },
      { label: "24px", value: "lg — section padding", swatch: null },
      { label: "32px", value: "xl — section gap", swatch: null },
      { label: "48px", value: "2xl — hero padding", swatch: null },
    ],
  },
];

const COMPONENTS = [
  "Button Primary", "Button Secondary", "Button Ghost", "Button Destructive",
  "Input Text", "Input Password", "Input OTP", "Textarea",
  "Card Profil", "Card Post", "Card Dokumen", "Card Match",
  "Bottom Nav", "Top App Bar", "Tab Bar", "Breadcrumb",
  "Badge Status", "Chip Filter", "Tag Peranan", "Dot Indicator",
  "Modal Sheet", "Bottom Sheet", "Alert Dialog", "Toast",
  "Avatar", "Avatar Group", "Progress Bar", "Skeleton Loader",
  "Toggle", "Checkbox", "Radio", "Dropdown",
  "Swipe Card", "Like/Pass Button", "Match Overlay", "Photo Blur",
];

const FLOWS = [
  {
    id: "F01", title: "Pembukaan & Splash",
    steps: ["Splash video", "Welcome screen"],
    color: "#6366f1",
  },
  {
    id: "F02", title: "Log Masuk",
    steps: ["Welcome", "Log Masuk", "Feed"],
    color: "#8b5cf6",
  },
  {
    id: "F03", title: "Pendaftaran Penuh",
    steps: ["Daftar Akaun", "Sahkan Emel", "Profil Asas", "Peranan & Status", "Perkahwinan Semasa", "Pilih Negeri", "Senarai Semak", "Detail Seksyen", "eKYC", "Muat Naik Dokumen", "Privasi Foto", "Feed"],
    color: "#3b82f6",
  },
  {
    id: "F04", title: "Explore & Match",
    steps: ["Explore", "Swipe Kad", "Match Overlay", "Safe Chat", "Photo Consent"],
    color: "#f97316",
  },
  {
    id: "F05", title: "Pengesahan Identiti",
    steps: ["Trust Gate Dashboard", "Status Pengesahan", "eKYC Upload", "Semakan Admin"],
    color: "#10b981",
  },
  {
    id: "F06", title: "Tetapan & Profil",
    steps: ["Akaun & Tetapan", "Edit Profil", "Privasi", "Dokumen", "Keselamatan"],
    color: "#94a3b8",
  },
];

const SCREENS_COUNT = 33;
const COMPONENTS_COUNT = COMPONENTS.length;
const FLOWS_COUNT = FLOWS.length;

type Tab = "overview" | "foundations" | "components" | "flows" | "screens";

export default function DesignDoc() {
  const [tab, setTab] = useState<Tab>("overview");
  const [expandedFlow, setExpandedFlow] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen w-full overflow-y-auto"
      style={{
        background: "linear-gradient(135deg, #0a0a14 0%, #0f0f1e 50%, #0a0a14 100%)",
        fontFamily: "'Inter', sans-serif",
        color: "#e2e8f0",
      }}
    >
      {/* ── COVER ────────────────────────────────── */}
      <div
        className="relative px-6 pt-16 pb-12"
        style={{
          background: "linear-gradient(160deg, #0f0f2e 0%, #1a0a2e 40%, #0a0a14 100%)",
          borderBottom: "1px solid #1e1e3f",
        }}
      >
        {/* decorative lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${10 + i * 16}%`,
                top: 0,
                bottom: 0,
                width: "1px",
                background: `rgba(201,168,76,${0.03 + i * 0.01})`,
              }}
            />
          ))}
        </div>

        <div className="relative">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: "#c9a84c", color: "#0a0a14" }}>
              P
            </div>
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "#c9a84c" }}>
              poligami.my
            </span>
          </div>

          <h1
            className="text-4xl font-bold leading-tight mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: "#f8fafc" }}
          >
            Mobile UI/UX
            <br />
            <span style={{ color: "#c9a84c" }}>Design System</span>
          </h1>
          <p className="text-sm mt-3 max-w-xs" style={{ color: "#64748b" }}>
            Sistem reka bentuk lengkap untuk aplikasi bimbingan dan pendaftaran poligami halal Malaysia.
          </p>

          <div className="flex gap-4 mt-8">
            {[
              { v: SCREENS_COUNT, l: "Skrin" },
              { v: COMPONENTS_COUNT, l: "Komponen" },
              { v: FLOWS_COUNT, l: "Aliran" },
              { v: PAGES.length, l: "Bahagian" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-2xl font-bold" style={{ color: "#c9a84c" }}>{s.v}</p>
                <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: "#475569" }}>{s.l}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-[10px] px-2 py-1 rounded" style={{ background: "#1e1e3f", color: "#818cf8" }}>
              v1.0.0
            </span>
            <span className="text-[10px]" style={{ color: "#334155" }}>React 19 · Vite 8 · Tailwind CSS v4</span>
          </div>
        </div>
      </div>

      {/* ── TABS ─────────────────────────────────── */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex gap-1 overflow-x-auto"
        style={{ background: "rgba(10,10,20,0.97)", borderBottom: "1px solid #1e1e3f" }}
      >
        {(["overview", "foundations", "components", "flows", "screens"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg transition-all capitalize"
            style={{
              background: tab === t ? "#c9a84c" : "transparent",
              color: tab === t ? "#0a0a14" : "#64748b",
              fontWeight: tab === t ? "600" : "400",
            }}
          >
            {t === "overview" ? "Overview" : t === "foundations" ? "Foundations" : t === "components" ? "Komponen" : t === "flows" ? "User Flows" : "Senarai Skrin"}
          </button>
        ))}
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6 pb-16">

        {/* ── OVERVIEW TAB ─────────────────────── */}
        {tab === "overview" && (
          <>
            <Section title="Fail & Bahagian">
              <div className="space-y-1">
                {PAGES.map((p) => (
                  <div
                    key={p.num}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e293b" }}
                  >
                    <span
                      className="text-[10px] font-mono font-bold mt-0.5 flex-shrink-0 w-6"
                      style={{ color: "#c9a84c" }}
                    >
                      {p.num}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200">{p.title}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "#475569" }}>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Design Principles">
              {[
                { icon: "🔒", title: "Amanah & Selamat", desc: "Privasi pengguna diutamakan. Gambar blur by default, consent diperlukan sebelum dedah." },
                { icon: "⚖️", title: "Patuh Undang-undang", desc: "Setiap negeri ada syarat berbeza. Senarai semak per-negeri memastikan compliance." },
                { icon: "💛", title: "Bermaruah", desc: "Reka bentuk yang menghormati sensitiviti budaya dan agama Islam." },
                { icon: "📱", title: "Mobile-First", desc: "Direka untuk skrin telefon. Setiap skrin responsive dan scrollable dengan nav kekal." },
              ].map((p) => (
                <div key={p.title} className="flex gap-3 px-3 py-3 rounded-xl mb-1"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e293b" }}>
                  <span className="text-xl flex-shrink-0">{p.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{p.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </Section>

            <Section title="Tech Stack">
              {[
                ["React", "19", "#61dafb"],
                ["Vite", "8", "#646cff"],
                ["TypeScript", "5.7", "#3178c6"],
                ["Tailwind CSS", "v4", "#38bdf8"],
              ].map(([name, ver, color]) => (
                <div key={name} className="flex items-center justify-between px-3 py-2 rounded-lg mb-1"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e293b" }}>
                  <span className="text-sm text-slate-300">{name}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: color + "22", color }}>v{ver}</span>
                </div>
              ))}
            </Section>
          </>
        )}

        {/* ── FOUNDATIONS TAB ───────────────────── */}
        {tab === "foundations" && (
          <>
            {FOUNDATIONS.map((f) => (
              <Section key={f.title} title={f.title}>
                {f.items.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 px-3 py-2 rounded-lg mb-1"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e293b" }}>
                    {item.swatch && (
                      <div
                        className="w-6 h-6 rounded-md flex-shrink-0 border"
                        style={{
                          background: item.swatch,
                          borderColor: item.swatch === "#ffffff" ? "#334155" : "transparent",
                        }}
                      />
                    )}
                    <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                      <span className="text-xs font-medium text-slate-300 flex-shrink-0">{item.label}</span>
                      <span className="text-[11px] font-mono text-right truncate" style={{ color: "#475569" }}>{item.value}</span>
                    </div>
                  </div>
                ))}
              </Section>
            ))}

            <Section title="Border Radius">
              {[
                { label: "sm", value: "8px", usage: "Badge, chip" },
                { label: "md", value: "12px", usage: "Button, input" },
                { label: "lg", value: "16px", usage: "Card, panel" },
                { label: "xl", value: "20px", usage: "Bottom sheet" },
                { label: "full", value: "9999px", usage: "Avatar, pill button" },
              ].map((r) => (
                <div key={r.label} className="flex items-center gap-3 px-3 py-2 rounded-lg mb-1"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e293b" }}>
                  <div
                    className="w-8 h-8 flex-shrink-0 bg-slate-700"
                    style={{ borderRadius: r.value }}
                  />
                  <div className="flex-1 flex justify-between">
                    <span className="text-xs text-slate-300">{r.label}</span>
                    <span className="text-[11px] font-mono" style={{ color: "#c9a84c" }}>{r.value}</span>
                  </div>
                  <span className="text-[10px]" style={{ color: "#334155" }}>{r.usage}</span>
                </div>
              ))}
            </Section>
          </>
        )}

        {/* ── COMPONENTS TAB ────────────────────── */}
        {tab === "components" && (
          <>
            <Section title={`${COMPONENTS_COUNT} Komponen`}>
              <div className="grid grid-cols-2 gap-1.5">
                {COMPONENTS.map((c) => {
                  const cat = c.includes("Button") ? "#6366f1"
                    : c.includes("Input") || c.includes("Textarea") ? "#3b82f6"
                    : c.includes("Card") ? "#8b5cf6"
                    : c.includes("Nav") || c.includes("Bar") || c.includes("Tab") || c.includes("Breadcrumb") ? "#10b981"
                    : c.includes("Badge") || c.includes("Chip") || c.includes("Tag") || c.includes("Dot") ? "#f59e0b"
                    : c.includes("Modal") || c.includes("Sheet") || c.includes("Alert") || c.includes("Toast") ? "#ef4444"
                    : c.includes("Swipe") || c.includes("Like") || c.includes("Match") || c.includes("Photo") ? "#f97316"
                    : "#64748b";
                  return (
                    <div key={c} className="px-2.5 py-2 rounded-lg flex items-center gap-2"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e293b" }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat }} />
                      <span className="text-[11px] text-slate-300 leading-tight">{c}</span>
                    </div>
                  );
                })}
              </div>
            </Section>

            <Section title="Kategori">
              {[
                { label: "Navigation", color: "#10b981", items: ["Bottom Nav", "Top App Bar", "Tab Bar"] },
                { label: "Input", color: "#3b82f6", items: ["Text Input", "Password", "OTP", "Textarea"] },
                { label: "Overlay", color: "#ef4444", items: ["Bottom Sheet", "Modal", "Alert Dialog", "Toast"] },
                { label: "Explore", color: "#f97316", items: ["Swipe Card", "Like/Pass", "Match Overlay"] },
                { label: "Status", color: "#f59e0b", items: ["Badge", "Chip", "Tag Peranan", "Progress Bar"] },
              ].map((cat) => (
                <div key={cat.label} className="px-3 py-2.5 rounded-xl mb-1"
                  style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${cat.color}33` }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                    <span className="text-xs font-semibold text-slate-200">{cat.label}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cat.items.map((i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: cat.color + "22", color: cat.color }}>
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </Section>
          </>
        )}

        {/* ── FLOWS TAB ─────────────────────────── */}
        {tab === "flows" && (
          <Section title="User Flows">
            {FLOWS.map((f) => (
              <div key={f.id} className="mb-2">
                <button
                  onClick={() => setExpandedFlow(expandedFlow === f.id ? null : f.id)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left"
                  style={{
                    background: expandedFlow === f.id ? f.color + "15" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${expandedFlow === f.id ? f.color + "66" : "#1e293b"}`,
                  }}
                >
                  <span className="text-[10px] font-mono font-bold w-8 flex-shrink-0" style={{ color: f.color }}>{f.id}</span>
                  <span className="flex-1 text-sm text-slate-200 font-medium">{f.title}</span>
                  <span className="text-[10px]" style={{ color: "#475569" }}>{f.steps.length} langkah</span>
                  <span className="text-slate-500 text-xs">{expandedFlow === f.id ? "▲" : "▼"}</span>
                </button>

                {expandedFlow === f.id && (
                  <div className="mt-1 px-3 py-3 rounded-xl space-y-2"
                    style={{ background: "rgba(255,255,255,0.01)", border: "1px solid #1e293b" }}>
                    {f.steps.map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                            style={{ background: f.color, color: "#0a0a14" }}>
                            {i + 1}
                          </div>
                          {i < f.steps.length - 1 && (
                            <div className="w-px h-4 mt-0.5" style={{ background: f.color + "44" }} />
                          )}
                        </div>
                        <span className="text-xs text-slate-300 pb-4">{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* ── SCREENS TAB ───────────────────────── */}
        {tab === "screens" && (
          <>
            {[
              {
                group: "Pembukaan",
                color: "#6366f1",
                screens: ["Splash (Video Animation)", "Welcome Screen"],
              },
              {
                group: "Autentikasi",
                color: "#8b5cf6",
                screens: ["Log Masuk", "Lupa Kata Laluan"],
              },
              {
                group: "Pendaftaran",
                color: "#3b82f6",
                screens: [
                  "Daftar Akaun (Nama · Emel · No Tel)",
                  "Sahkan Emel (Countdown 15 min)",
                  "Profil Asas (Gambar · Umur · Pekerjaan)",
                  "Peranan & Status (6 pilihan)",
                  "Perkahwinan Semasa",
                  "Pilih Negeri (14 negeri)",
                  "Senarai Semak Undang-undang",
                  "Detail Seksyen (Baca & tandakan)",
                  "Pengesahan Identiti (eKYC)",
                  "Muat Naik Dokumen",
                  "Privasi Foto",
                ],
              },
              {
                group: "Tab Utama",
                color: "#10b981",
                screens: [
                  "Feed (Post daripada match)",
                  "Explore (Swipe kad profil)",
                  "Ruang Semak (Trust Gate Dashboard)",
                  "Chat Inbox",
                  "Profil & Tetapan",
                ],
              },
              {
                group: "Explore & Match",
                color: "#f97316",
                screens: [
                  "Profil Calon (Lihat penuh)",
                  "Match Overlay",
                  "Safe Chat",
                  "Permohonan Foto",
                  "Lapor Keselamatan",
                ],
              },
              {
                group: "Pengesahan & Kepercayaan",
                color: "#eab308",
                screens: ["Status Pengesahan", "Panduan Poligami"],
              },
              {
                group: "Tetapan",
                color: "#94a3b8",
                screens: [
                  "Maklumat Profil (Inline edit)",
                  "Privasi & Keselamatan",
                  "Dokumen Saya",
                  "Notifikasi",
                  "Keselamatan Akaun",
                  "Bantuan & FAQ",
                  "Polisi Privasi",
                  "Terma Penggunaan",
                  "Padam Akaun (3-langkah)",
                ],
              },
            ].map((g) => (
              <div key={g.group} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: g.color }} />
                  <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: g.color }}>
                    {g.group}
                  </p>
                  <span className="text-[10px]" style={{ color: "#334155" }}>· {g.screens.length} skrin</span>
                </div>
                <div className="space-y-1">
                  {g.screens.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e293b" }}>
                      <span className="text-[10px] font-mono w-4 flex-shrink-0" style={{ color: "#334155" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xs text-slate-300">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-4 flex gap-3">
              {[
                { label: "Jumlah Skrin", value: SCREENS_COUNT },
                { label: "Kumpulan", value: 7 },
              ].map((s) => (
                <div key={s.label} className="flex-1 rounded-2xl p-4 text-center"
                  style={{ background: "rgba(201,168,76,0.08)", border: "1px solid #c9a84c33" }}>
                  <p className="text-2xl font-bold" style={{ color: "#c9a84c" }}>{s.value}</p>
                  <p className="text-[10px] mt-0.5 uppercase tracking-widest" style={{ color: "#64748b" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest mb-2 font-semibold" style={{ color: "#c9a84c" }}>
        {title}
      </p>
      {children}
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import * as db from "@/lib/db";
import type { Profile as UserProfile } from "@/lib/types";
import { CHAT_SUGGESTIONS } from "@/lib/types";

function SplashScreen({ onDone }: { onDone: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fading, setFading] = useState(false);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setFading(true);
    setTimeout(onDone, 600);
  };

  useEffect(() => {
    const v = videoRef.current;
    // Hard timeout: skip splash after 8 s regardless of video state
    const timer = setTimeout(finish, 8000);
    if (!v) return () => clearTimeout(timer);
    v.play().catch(finish);
    v.addEventListener("ended", finish);
    v.addEventListener("error", finish);
    return () => {
      clearTimeout(timer);
      v.removeEventListener("ended", finish);
      v.removeEventListener("error", finish);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      style={{ opacity: fading ? 0 : 1, transition: "opacity 0.6s ease" }}
    >
      <video
        ref={videoRef}
        src="/splash.mp4"
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="font-serif text-white text-3xl tracking-tight">poligami.my</span>
      </div>
      {/* skip button */}
      <button
        onClick={finish}
        className="absolute bottom-10 right-6 text-white/60 text-xs tracking-[0.2em] uppercase border border-white/20 rounded-full px-4 py-2 hover:text-white hover:border-white/50 transition-colors"
      >
        Langkau
      </button>
    </div>
  );
}

type Screen =
  | "welcome"
  | "login"
  | "pre-registration"
  | "email-verification"
  | "create-profile"
  | "role-status"
  | "current-marriage"
  | "select-state"
  | "legal-checklist"
  | "checklist-detail"
  | "identity-verification"
  | "upload-documents"
  | "photo-privacy"
  | "trust-gate-dashboard"
  | "candidate-profile"
  | "photo-consent-request"
  | "structured-introduction"
  | "safe-chat"
  | "report-safety"
  | "account-settings"
  | "verification-status"
  | "panduan"
  | "explore"
  | "feed"
  | "chat-inbox"
  | "settings-profil"
  | "settings-privasi"
  | "settings-dokumen"
  | "settings-notifikasi"
  | "settings-keselamatan"
  | "bantuan"
  | "polisi-privasi"
  | "terma-penggunaan"
  | "padam-akaun"
  | "setup-complete";

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1 w-full">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-0.5 flex-1 ${i < current ? "bg-black" : "bg-gray-200"}`}
        />
      ))}
    </div>
  );
}

function LoginScreen({ onSuccess, onBack, onRegister }: { onSuccess: (user: UserProfile) => void; onBack: () => void; onRegister: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handle = async () => {
    if (!email.trim() || !email.includes("@")) { setError("Masukkan e-mel yang sah."); return; }
    if (!password) { setError("Masukkan kata laluan."); return; }
    setBusy(true);
    try {
      const user = await db.signIn(email, password);
      onSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Log masuk gagal.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col h-full px-6 py-10 bg-white overflow-y-auto">
      <button onClick={onBack} className="mb-8 text-black w-fit">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      <div className="mb-10">
        <span className="font-serif text-2xl">poligami.my</span>
        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mt-6 mb-2">Selamat Kembali</p>
        <h1 className="font-serif text-4xl font-normal leading-tight">Log masuk<br />ke akaun anda.</h1>
      </div>

      <div className="flex flex-col gap-4 mb-3">
        <div>
          <label className="text-xs tracking-[0.15em] uppercase text-gray-500 block mb-1.5">E-mel</label>
          <input
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            className="w-full border border-gray-300 rounded-xl px-4 py-4 text-base outline-none focus:border-black transition-colors"
          />
        </div>
        <div>
          <label className="text-xs tracking-[0.15em] uppercase text-gray-500 block mb-1.5">Kata Laluan</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handle()}
              className="w-full border border-gray-300 rounded-xl px-4 py-4 pr-12 text-base outline-none focus:border-black transition-colors"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {showPw
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

      <button
        onClick={() => setError("Ciri tetapkan semula kata laluan belum diaktifkan dalam binaan debug ini.")}
        className="text-right text-xs text-gray-500 underline underline-offset-2 mb-8 self-end"
      >
        Lupa kata laluan?
      </button>

      <button
        onClick={handle}
        disabled={busy}
        className="w-full bg-black text-white rounded-full py-4 text-base font-medium hover:bg-gray-900 transition-colors mb-5 disabled:opacity-50"
      >
        {busy ? "Sedang masuk..." : "Log Masuk"}
      </button>

      <p className="text-center text-sm text-gray-500">
        Belum ada akaun?{" "}
        <button onClick={onRegister} className="underline font-medium text-black">Daftar akaun</button>
      </p>
    </div>
  );
}

function WelcomeScreen({ onStart, onLogin }: { onStart: () => void; onLogin: () => void }) {
  return (
    <div className="flex flex-col h-full px-6 py-10 bg-white overflow-y-auto">
      <div className="text-center mt-6 mb-16">
        <span className="font-serif text-3xl font-normal tracking-tight">
          poligami<span className="text-gray-500">.my</span>
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-4 text-center">Ruang Peribadi</p>
        <h1 className="font-serif text-5xl font-normal leading-[1.1] text-center mb-6">
          Niat disusun<br />dengan tertib.
        </h1>
        <p className="text-gray-500 text-base text-center leading-relaxed mb-16">
          Ruang peribadi untuk memahami proses,<br />
          melengkapkan semakan dan bergerak<br />
          dengan lebih berhati-hati.
        </p>

        <button
          onClick={onLogin}
          className="w-full bg-black text-white rounded-full py-4 text-base font-medium tracking-wide hover:bg-gray-900 transition-colors"
        >
          Log Masuk
        </button>
        <p className="text-center mt-5 text-gray-600 text-sm">
          Belum ada akaun?{" "}
          <button onClick={onStart} className="underline font-medium text-black">
            Daftar akaun
          </button>
        </p>

      </div>

      <div className="flex justify-around items-start pt-10 border-t border-gray-100 mt-10">
        {[
          { icon: "🔒", label: "PROFIL\nTERTUTUP" },
          { icon: "👤", label: "FOTO ATAS\nPERSETUJUAN" },
          { icon: "💬", label: "CHAT SELEPAS\nTRUST GATE" },
        ].map(({ label }, i) => (
          <div key={i} className="flex flex-col items-center gap-3 flex-1">
            {i === 0 && (
              <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            )}
            {i === 1 && (
              <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}
            {i === 2 && (
              <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            )}
            {i === 1 && <div className="w-px h-8 bg-gray-200 absolute" style={{ display: "none" }} />}
            <p className="text-[10px] tracking-[0.15em] text-gray-500 uppercase text-center leading-relaxed whitespace-pre-line">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreRegistrationScreen({ onNext, onBack }: { onNext: (data: { name: string; email: string; phone: string }) => Promise<void> | void; onBack: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Nama diperlukan.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Masukkan e-mel yang sah.";
    if (!phone.trim() || phone.replace(/\D/g, "").length < 9) e.phone = "Nombor telefon tidak sah.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="flex flex-col h-full px-6 py-8 bg-white overflow-y-auto">
      <header className="flex items-center justify-between mb-1">
        <span className="font-serif text-lg">poligami.my</span>
      </header>
      <ProgressBar current={1} total={2} />

      <div className="mt-8 mb-8">
        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-3">Pendaftaran</p>
        <h1 className="font-serif text-5xl font-normal leading-[1.1] mb-4">
          Cipta akaun<br />anda.
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Isi maklumat asas untuk mencipta<br />akaun poligami.my anda.
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        <div>
          <input
            type="text" placeholder="Nama penuh"
            value={name} onChange={(e) => setName(e.target.value)}
            className={`w-full border rounded-xl px-4 py-4 text-base outline-none transition-colors ${errors.name ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-black"}`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1 ml-1">{errors.name}</p>}
        </div>
        <div>
          <input
            type="email" placeholder="E-mel"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className={`w-full border rounded-xl px-4 py-4 text-base outline-none transition-colors ${errors.email ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-black"}`}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
        </div>
        <div>
          <input
            type="tel" placeholder="Nombor telefon (cth: 0123456789)"
            value={phone} onChange={(e) => setPhone(e.target.value)}
            className={`w-full border rounded-xl px-4 py-4 text-base outline-none transition-colors ${errors.phone ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-black"}`}
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1 ml-1">{errors.phone}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 shrink-0">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="text-xs text-gray-400">Maklumat tidak dipaparkan kepada umum.</span>
      </div>

      {formError && <p className="text-xs text-red-500 mb-4">{formError}</p>}

      <button
        disabled={busy}
        onClick={async () => {
          if (!validate()) return;
          setBusy(true);
          setFormError("");
          try {
            await onNext({ name, email, phone });
          } catch (err) {
            setFormError(err instanceof Error ? err.message : "Pendaftaran gagal.");
          } finally {
            setBusy(false);
          }
        }}
        className="w-full bg-black text-white rounded-full py-4 text-base font-medium tracking-wide hover:bg-gray-900 transition-colors mb-5 disabled:opacity-50"
      >
        {busy ? "Sedang menghantar..." : "Daftar akaun"}
      </button>
      <button onClick={onBack} className="flex items-center justify-center gap-2 text-sm text-gray-700 underline underline-offset-2">
        <span>←</span> Kembali
      </button>
    </div>
  );
}

function EmailVerificationScreen({ onNext, onBack, email, devToken }: { onNext: () => void; onBack: () => void; email: string; devToken?: string }) {
  const [seconds, setSeconds] = useState(900); // 15 min
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [verified, setVerified] = useState(() => db.isEmailVerified(email));
  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (verified) return;
    const id = setInterval(() => {
      if (db.isEmailVerified(email)) setVerified(true);
    }, 1500);
    return () => clearInterval(id);
  }, [email, verified]);

  useEffect(() => {
    if (verified) onNextRef.current();
  }, [verified]);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleResend = async () => {
    setSeconds(900);
    setResent(true);
    setCooldown(60);
    setTimeout(() => setResent(false), 3000);
    const pending = db.getPending(email);
    if (!pending) return;
    try {
      await fetch(db.apiUrl("/api/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: pending.fullName, email: pending.email, phone: pending.phone, token: pending.token }),
      });
    } catch { /* keep local token */ }
  };

  const displayEmail = email || "e-mel anda";

  return (
    <div className="flex flex-col h-full px-6 py-8 bg-white overflow-y-auto">
      <header className="flex items-center justify-between mb-2">
        <span className="font-serif text-lg">poligami.my</span>
      </header>
      <div className="mb-8">
        <ProgressBar current={1} total={2} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-8">Pengesahan E-mel</p>

        <div className="mb-8">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M50 10 Q55 5 60 10 Q65 5 70 10 Q75 7 78 12 Q83 10 85 16 Q90 15 91 21 Q96 22 95 28 Q99 30 97 36 Q100 39 97 44 Q99 48 95 51 Q96 56 91 58 Q91 64 85 65 Q83 71 78 71 Q75 76 70 74 Q65 78 60 74 Q55 78 50 74 Q45 78 40 74 Q35 76 32 71 Q27 71 25 65 Q19 64 19 58 Q14 56 15 51 Q11 48 13 44 Q10 39 13 36 Q11 30 15 28 Q14 22 19 21 Q18 15 25 16 Q27 10 32 12 Q35 7 40 10 Q45 5 50 10Z" strokeLinejoin="round" />
            <polyline points="35,50 47,62 65,40" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="font-serif text-5xl font-normal leading-[1.1] mb-6">
          Semak peti<br />masuk anda.
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Kami telah menghantar pautan<br />
          pengesahan ke <strong className="text-black">{displayEmail}.</strong>
        </p>

        <div className="w-full border border-gray-200 rounded-xl flex items-center gap-3 px-5 py-4 mb-5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 shrink-0">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          <div className="w-px h-6 bg-gray-200" />
          <span className="text-xs tracking-[0.15em] text-gray-600 uppercase">
            {seconds > 0 ? `Pautan sah: ${fmt(seconds)}` : "Pautan telah tamat tempoh"}
          </span>
        </div>

        {devToken && !verified && (
          <button
            onClick={() => { db.verifyToken(devToken); setVerified(true); }}
            className="w-full border border-gray-300 rounded-full py-4 text-base font-medium hover:bg-gray-50 transition-colors mb-3"
          >
            Buka pautan pengesahan
          </button>
        )}
        <button
          disabled={!verified}
          onClick={onNext}
          className={`w-full rounded-full py-4 text-base font-medium mb-3 ${verified ? "bg-black text-white hover:bg-gray-900" : "bg-gray-200 text-gray-400"}`}
        >
          {verified ? "E-mel disahkan — teruskan" : "Menunggu pengesahan e-mel..."}
        </button>

        <button
          onClick={handleResend}
          disabled={cooldown > 0}
          className={`w-full border rounded-full flex items-center justify-center gap-3 py-4 text-base font-medium transition-colors mb-5 ${cooldown > 0 ? "border-gray-200 text-gray-400" : "border-black hover:bg-gray-50"}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          {resent ? "E-mel dihantar semula!" : cooldown > 0 ? `Hantar semula (${cooldown}s)` : "Hantar semula e-mel"}
        </button>

        <button onClick={onBack} className="text-sm underline underline-offset-2 text-gray-600">Tukar alamat e-mel</button>
      </div>

      <div className="border-t border-gray-100 mt-8 pt-4 flex items-center gap-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 shrink-0">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><circle cx="12" cy="11" r="1" /><line x1="12" y1="13" x2="12" y2="15" />
        </svg>
        <span className="text-xs text-gray-400">Jangan kongsi pautan ini dengan sesiapa.</span>
      </div>
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ aksara", ok: password.length >= 8 },
    { label: "Huruf besar", ok: /[A-Z]/.test(password) },
    { label: "Nombor", ok: /[0-9]/.test(password) },
    { label: "Simbol", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400"];
  const labels = ["Sangat lemah", "Lemah", "Sederhana", "Kuat"];
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[0,1,2,3].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < score ? colors[score - 1] : "bg-gray-200"}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map(c => (
            <span key={c.label} className={`text-[10px] flex items-center gap-1 ${c.ok ? "text-gray-700" : "text-gray-400"}`}>
              <span>{c.ok ? "✓" : "·"}</span>{c.label}
            </span>
          ))}
        </div>
        <span className={`text-[10px] font-medium ${score >= 3 ? "text-green-600" : score >= 2 ? "text-yellow-600" : "text-red-500"}`}>{labels[score - 1] ?? ""}</span>
      </div>
    </div>
  );
}

function CreateProfileScreen({ onNext, onBack, initialName = "" }: { onNext: (data: { displayName: string; age: number; occupation: string; password: string; photoUrl: string | null }) => void; onBack: () => void; initialName?: string }) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState(initialName);
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pwChecks = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)];
  const pwStrong = pwChecks.every(Boolean);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!displayName.trim()) e.name = "Nama paparan diperlukan.";
    if (!age || parseInt(age) < 18 || parseInt(age) > 80) e.age = "Umur mesti antara 18–80.";
    if (!occupation.trim()) e.occ = "Pekerjaan diperlukan.";
    if (!pwStrong) e.pw = "Kata laluan mesti 8+ aksara, huruf besar, nombor, dan simbol.";
    if (password !== confirmPassword) e.cpw = "Kata laluan tidak sepadan.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="flex flex-col h-full px-6 py-8 bg-white overflow-y-auto">
      <header className="flex items-center justify-between mb-1">
        <button onClick={onBack} className="text-black">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
        </button>
        <span className="font-serif text-lg">poligami.my</span>
        <div className="w-5" />
      </header>
      <ProgressBar current={1} total={5} />

      <div className="mt-8 mb-6">
        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-2">Maklumat Asas</p>
        <h1 className="font-serif text-4xl font-normal leading-tight mb-2">Kenali ruang anda.</h1>
        <p className="text-gray-500 text-sm leading-relaxed">Maklumat ini membantu membina profil yang lebih jelas dan tertib.</p>
      </div>

      <div className="flex flex-col items-center mb-6">
        <button onClick={() => photoInputRef.current?.click()} className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center mb-4 overflow-hidden hover:opacity-80 transition-opacity">
          {photoPreview
            ? <img src={photoPreview} alt="profil" className="w-full h-full object-cover" />
            : <svg width="60" height="60" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="30" r="18" fill="#d1d5db" /><ellipse cx="40" cy="65" rx="26" ry="16" fill="#d1d5db" /></svg>}
        </button>
        <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (f) setPhotoPreview(await db.fileToDataUrl(f)); }} />
        <button onClick={() => photoInputRef.current?.click()} className="border border-gray-300 rounded-full px-6 py-2 flex items-center gap-2 text-xs tracking-[0.15em] uppercase hover:bg-gray-50 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
          {photoPreview ? "Tukar Foto" : "Tambah Foto Kemudian"}
        </button>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="text-xs tracking-[0.15em] uppercase text-gray-500 block mb-1.5">Nama Paparan</label>
          <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Nama paparan" className={`w-full border rounded-xl px-4 py-3.5 text-base outline-none transition-colors ${errors.name ? "border-red-400" : "border-gray-300 focus:border-black"}`} />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="text-xs tracking-[0.15em] uppercase text-gray-500 block mb-1.5">Umur</label>
          <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Umur" className={`w-full border rounded-xl px-4 py-3.5 text-base outline-none transition-colors ${errors.age ? "border-red-400" : "border-gray-300 focus:border-black"}`} />
          {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
        </div>
        <div>
          <label className="text-xs tracking-[0.15em] uppercase text-gray-500 block mb-1.5">Pekerjaan</label>
          <input type="text" value={occupation} onChange={e => setOccupation(e.target.value)} placeholder="Arkitek" className={`w-full border rounded-xl px-4 py-3.5 text-base outline-none transition-colors ${errors.occ ? "border-red-400" : "border-gray-300 focus:border-black"}`} />
          {errors.occ && <p className="text-xs text-red-500 mt-1">{errors.occ}</p>}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs tracking-[0.15em] uppercase text-gray-500 mb-3">Kata Laluan</p>
          <div className="relative mb-1">
            <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Cipta kata laluan" className={`w-full border rounded-xl px-4 py-3.5 pr-12 text-base outline-none transition-colors ${errors.pw ? "border-red-400" : "border-gray-300 focus:border-black"}`} />
            <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{showPw ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}</svg>
            </button>
          </div>
          <PasswordStrength password={password} />
          {errors.pw && <p className="text-xs text-red-500 mt-1">{errors.pw}</p>}
        </div>

        <div className="relative">
          <input type={showCpw ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Sahkan kata laluan" className={`w-full border rounded-xl px-4 py-3.5 pr-12 text-base outline-none transition-colors ${errors.cpw ? "border-red-400" : confirmPassword && confirmPassword === password ? "border-green-400" : "border-gray-300 focus:border-black"}`} />
          <button type="button" onClick={() => setShowCpw(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{showCpw ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}</svg>
          </button>
          {errors.cpw && <p className="text-xs text-red-500 mt-1">{errors.cpw}</p>}
          {confirmPassword && confirmPassword === password && <p className="text-xs text-green-600 mt-1">✓ Kata laluan sepadan</p>}
        </div>
      </div>

      <button onClick={() => { if (validate()) onNext({ displayName, age: parseInt(age, 10), occupation, password, photoUrl: photoPreview }); }} className="w-full bg-black text-white rounded-full py-4 text-xs font-medium tracking-[0.2em] uppercase hover:bg-gray-900 transition-colors mb-3">Seterusnya</button>
      <div className="flex items-center justify-center gap-2">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
        <span className="text-xs text-gray-400">Nama penuh tidak dipaparkan kepada ahli lain.</span>
      </div>
    </div>
  );
}

const roles = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="20" cy="12" r="8" />
        <path d="M5 38c0-8.284 6.716-15 15-15s15 6.716 15 15" />
      </svg>
    ),
    label: "Lelaki — Belum berkahwin",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="20" cy="12" r="8" />
        <path d="M5 38c0-8.284 6.716-15 15-15s15 6.716 15 15" />
        <circle cx="30" cy="14" r="4" fill="currentColor" />
      </svg>
    ),
    label: "Lelaki — Sudah berkahwin",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="20" cy="12" r="8" />
        <path d="M5 38c0-8.284 6.716-15 15-15s15 6.716 15 15" />
        <path d="M16 10 Q20 6 24 10" />
      </svg>
    ),
    label: "Wanita — Belum berkahwin",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="20" cy="12" r="8" />
        <path d="M5 38c0-8.284 6.716-15 15-15s15 6.716 15 15" />
        <line x1="14" y1="8" x2="26" y2="8" strokeWidth="1.5" strokeDasharray="2 2" />
      </svg>
    ),
    label: "Lelaki — Duda",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="20" cy="12" r="8" />
        <path d="M5 38c0-8.284 6.716-15 15-15s15 6.716 15 15" />
        <path d="M16 10 Q20 6 24 10" />
        <line x1="14" y1="8" x2="26" y2="8" strokeWidth="1.5" strokeDasharray="2 2" />
      </svg>
    ),
    label: "Wanita — Janda",
  },
  {
    icon: (
      <svg width="32" height="28" viewBox="0 0 50 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="16" cy="12" r="7" />
        <path d="M2 36c0-7.18 6.268-13 14-13" />
        <circle cx="34" cy="12" r="7" />
        <path d="M48 36c0-7.18-6.268-13-14-13" />
        <path d="M20 36c0-7.18 3.582-13 8-13s8 5.82 8 13" />
      </svg>
    ),
    label: "Pasangan sedia ada —\nMahu memahami proses",
    twoLine: true,
  },
];

function RoleStatusScreen({ onNext, onBack }: { onNext: (role: string) => void; onBack: () => void }) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col h-full px-6 py-8 bg-white overflow-y-auto">
      <header className="flex items-center justify-between mb-1">
        <button onClick={onBack} className="text-black">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <span className="font-serif text-lg">poligami.my</span>
        <div className="w-5" />
      </header>
      <ProgressBar current={2} total={5} />

      <div className="mt-8 mb-8">
        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-2">Peranan & Status</p>
        <h1 className="font-serif text-4xl font-normal leading-tight mb-3">
          Nyatakan keadaan<br />anda dengan jujur.
        </h1>
        <p className="text-gray-500 text-sm">Status perlu diisytiharkan sebelum interaksi dibuka.</p>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        {roles.map((role, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all text-left ${
              selected === i
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-300 hover:border-gray-400"
            }`}
          >
            <div className={`shrink-0 ${selected === i ? "text-white" : "text-black"}`}>
              {role.icon}
            </div>
            <div className="w-px h-8 bg-current opacity-20" />
            <span className="text-sm font-medium whitespace-pre-line">{role.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => onNext(roles[selected].label.replace("\n", " "))}
        className="w-full bg-black text-white rounded-full py-4 text-xs font-medium tracking-[0.2em] uppercase hover:bg-gray-900 transition-colors"
      >
        Teruskan
      </button>
    </div>
  );
}

function CurrentMarriageScreen({ onNext, onBack, initialState = "Selangor" }: { onNext: (data: { duration: string; children: string; state: string; informed: boolean; consulted: boolean }) => void; onBack: () => void; initialState?: string }) {
  const [duration, setDuration] = useState("Belum berkahwin");
  const [children, setChildren] = useState("0");
  const [state, setState] = useState(initialState);
  const [informed, setInformed] = useState(false);
  const [consulted, setConsulted] = useState(true);

  return (
    <div className="flex flex-col h-full px-6 py-8 bg-white overflow-y-auto">
      <header className="flex items-center justify-between mb-1">
        <button onClick={onBack} className="text-black">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <span className="font-serif text-lg">poligami.my</span>
      </header>
      <div className="mt-1 mb-6">
        <ProgressBar current={3} total={5} />
      </div>

      <div className="mb-6">
        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-2">Status Perkahwinan</p>
        <h1 className="font-serif text-4xl font-normal leading-tight mb-2">Maklumat semasa.</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Jawab dengan teliti. Maklumat tertentu<br />memerlukan semakan.
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="text-xs tracking-[0.15em] uppercase text-gray-500 block mb-1.5">Tempoh Perkahwinan</label>
          <div className="relative">
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-base outline-none focus:border-black appearance-none bg-white"
            >
              <option value="Belum berkahwin">Belum berkahwin</option>
              {Array.from({ length: 30 }, (_, i) => (
                <option key={i} value={`${i + 1} tahun`}>{i + 1} tahun</option>
              ))}
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        <div>
          <label className="text-xs tracking-[0.15em] uppercase text-gray-500 block mb-1.5">Bilangan Anak</label>
          <div className="relative">
            <select
              value={children}
              onChange={(e) => setChildren(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-base outline-none focus:border-black appearance-none bg-white"
            >
              {Array.from({ length: 15 }, (_, i) => (
                <option key={i} value={`${i}`}>{i}</option>
              ))}
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        <div>
          <label className="text-xs tracking-[0.15em] uppercase text-gray-500 block mb-1.5">Negeri Pernikahan</label>
          <div className="relative">
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-base outline-none focus:border-black appearance-none bg-white"
            >
              {["Selangor", "Wilayah Persekutuan", "Johor", "Pulau Pinang", "Perak", "Negeri Sembilan", "Pahang", "Terengganu", "Kelantan", "Kedah", "Perlis", "Sabah", "Sarawak"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        <div>
          <label className="text-xs tracking-[0.15em] uppercase text-gray-500 block mb-2">Adakah Pasangan Dimaklumkan?</label>
          <div className="flex rounded-xl border border-gray-300 overflow-hidden">
            {["BELUM", "YA"].map((opt) => (
              <button
                key={opt}
                onClick={() => setInformed(opt === "YA")}
                className={`flex-1 py-3.5 text-xs tracking-[0.15em] font-medium transition-all ${
                  (opt === "YA") === informed ? "bg-black text-white" : "bg-white text-black hover:bg-gray-50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs tracking-[0.15em] uppercase text-gray-500 block mb-2">Adakah Konsultasi Awal Dibuat?</label>
          <div className="flex rounded-xl border border-gray-300 overflow-hidden">
            {["YA", "TIDAK"].map((opt) => (
              <button
                key={opt}
                onClick={() => setConsulted(opt === "YA")}
                className={`flex-1 py-3.5 text-xs tracking-[0.15em] font-medium transition-all ${
                  (opt === "YA") === consulted ? "bg-black text-white" : "bg-white text-black hover:bg-gray-50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl flex items-center gap-3 px-4 py-3 mb-5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-500 shrink-0">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="text-xs text-gray-500">Maklumat sensitif kekal tertutup.</span>
      </div>

      <button
        onClick={() => onNext({ duration, children, state, informed, consulted })}
        className="w-full bg-black text-white rounded-full py-4 text-xs font-medium tracking-[0.2em] uppercase hover:bg-gray-900 transition-colors"
      >
        Simpan & Teruskan
      </button>
    </div>
  );
}

const malaysianStates = [
  "Selangor",
  "Wilayah Persekutuan",
  "Johor",
  "Pulau Pinang",
  "Perak",
  "Negeri Sembilan",
  "Pahang",
  "Terengganu",
  "Kelantan",
  "Kedah",
  "Perlis",
  "Sabah",
  "Sarawak",
];

function SelectStateScreen({
  onNext,
  onBack,
  selected = "Selangor",
  onSelect = () => {},
}: {
  onNext: () => void;
  onBack: () => void;
  selected?: string;
  onSelect?: (s: string) => void;
}) {
  return (
    <div className="flex flex-col h-full px-6 py-8 bg-white overflow-y-auto">
      <header className="flex items-center justify-between mb-1">
        <button onClick={onBack} className="text-black">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <span className="font-serif text-lg">poligami.my</span>
        <div className="w-5" />
      </header>
      <ProgressBar current={4} total={6} />

      <div className="mt-8 mb-6">
        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-2">Lokasi & Prosedur</p>
        <h1 className="font-serif text-4xl font-normal leading-tight mb-3">
          Pilih negeri berkaitan.
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Keperluan rasmi berbeza mengikut negeri<br />dan Mahkamah Syariah.
        </p>
      </div>

      <div className="mb-6">
        <label className="text-xs tracking-[0.15em] uppercase text-gray-500 block mb-1.5">Negeri</label>
        <div className="relative">
          <select
            value={selected}
            onChange={(e) => onSelect(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-4 text-base outline-none focus:border-black appearance-none bg-white transition-colors"
          >
            {malaysianStates.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {selected && (
        <div className="border border-gray-200 rounded-xl px-4 py-4 mb-5 flex items-start gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 shrink-0 mt-0.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <div>
            <p className="text-xs tracking-[0.1em] uppercase text-gray-400 mb-0.5">Negeri dipilih</p>
            <p className="text-sm font-medium text-black">{selected}</p>
            <p className="text-xs text-gray-400 mt-1">Keperluan Mahkamah Syariah {selected} akan dipaparkan.</p>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-xl flex items-center gap-3 px-4 py-3 mb-5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 shrink-0">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span className="text-xs text-gray-500">Anda boleh menukar negeri kemudian.</span>
      </div>

      <button
        onClick={onNext}
        disabled={!selected}
        className="w-full bg-black text-white rounded-full py-4 text-base font-medium hover:bg-gray-900 transition-colors disabled:opacity-40"
      >
        Lihat panduan negeri
      </button>
    </div>
  );
}

// ─── Checklist data ────────────────────────────────────────────────────────

type ChecklistSection = { heading: string; body: string };
type ChecklistItemDef = { num: string; label: string; sections: ChecklistSection[] };

function getChecklistContent(state: string): ChecklistItemDef[] {
  const court = `Mahkamah Syariah ${state}`;
  return [
    {
      num: "01",
      label: "Fahami syarat permohonan",
      sections: [
        {
          heading: "Kelayakan asas pemohon",
          body: `Di ${state}, pemohon poligami mestilah seorang lelaki Muslim yang berumur sekurang-kurangnya 18 tahun dan telah berkahwin secara sah di sisi undang-undang Islam. Pemohon tidak boleh mempunyai rekod jenayah yang membabitkan keganasan rumah tangga atau kegagalan memberi nafkah.\n\n${court} akan menyemak rekod perkahwinan sedia ada pemohon sebelum membenarkan sebarang permohonan baru diproses.`,
        },
        {
          heading: "Syarat calon isteri baru",
          body: `Calon isteri baru mestilah seorang Muslimah yang berstatus bujang, janda, atau telah bercerai. Jika calon masih di bawah umur menurut undang-undang sivil, kebenaran khas daripada Hakim Syarie ${state} diperlukan.\n\nCalon juga perlu hadir secara peribadi di hadapan ${court} pada tarikh sebutan kes untuk memberikan persetujuan secara lisan.`,
        },
        {
          heading: "Garis panduan ${state}",
          body: `${court} menggunakan Enakmen Undang-undang Keluarga Islam ${state} sebagai rujukan utama. Seksyen berkaitan poligami menetapkan bahawa mahkamah boleh memberi kebenaran hanya jika pernikahan itu "adil dan perlu" — bukan sekadar keinginan peribadi.\n\nPemohon perlu membuktikan bahawa isteri semasa tidak mampu memenuhi keperluan biologinya, atau menderita penyakit yang menghalang kehidupan berumah tangga.`,
        },
      ],
    },
    {
      num: "02",
      label: "Sediakan maklumat kewangan",
      sections: [
        {
          heading: "Pendapatan dan tanggungan",
          body: `${court} memerlukan bukti pendapatan terkini pemohon. Ini termasuk slip gaji tiga bulan terakhir (atau penyata akaun bank jika bekerja sendiri), penyata cukai pendapatan terkini, serta senarai tanggungan semasa termasuk isteri dan anak-anak.\n\nPendapatan bersih bulanan pemohon selepas tolak semua perbelanjaan semasa mesti mencukupi untuk menanggung isteri baru dan keluarga baru yang bakal ditanggung.`,
        },
        {
          heading: "Aset dan liabiliti",
          body: `Sediakan senarai penuh aset: hartanah, kenderaan, simpanan bank, pelaburan unit amanah dan KWSP. Liabiliti seperti pinjaman perumahan, pinjaman kereta, dan kad kredit perlu didedahkan sepenuhnya.\n\n${court} berhak untuk melantik pegawai penilai bagi menilai kapasiti kewangan pemohon secara bebas sekiranya timbul keraguan terhadap maklumat yang dikemukakan.`,
        },
        {
          heading: "Rancangan pembahagian nafkah",
          body: `Pemohon perlu mengemukakan rancangan bertulis tentang bagaimana nafkah akan dibahagikan secara adil antara isteri sedia ada dan isteri baru. Ini termasuk jumlah bulanan untuk setiap isteri, perumahan, pendidikan anak-anak, dan perbelanjaan perubatan.\n\nMahkamah ${state} amat menekankan aspek keadilan (adl) — sebarang ketidakseimbangan yang ketara boleh menjadi alasan penolakan permohonan.`,
        },
        {
          heading: "Dokumen sokongan kewangan",
          body: `Dokumen yang perlu disediakan:\n• 3 slip gaji terkini / penyata bank 6 bulan\n• Penyata KWSP terkini\n• Geran hartanah (jika ada)\n• Penyata pinjaman & kad kredit\n• Surat pengesahan majikan\n\nSemua dokumen perlu disahkan benar oleh Pesuruhjaya Sumpah sebelum difailkan di ${court}.`,
        },
      ],
    },
    {
      num: "03",
      label: "Dokumen perkahwinan & keluarga",
      sections: [
        {
          heading: "Dokumen perkahwinan sedia ada",
          body: `Sijil nikah perkahwinan pertama (atau semua perkahwinan sebelumnya) mestilah diserahkan kepada ${court}. Jika perkahwinan dilakukan di luar negeri, sijil perlu diterjemah ke Bahasa Malaysia oleh penterjemah bertauliah dan disahkan oleh Jabatan Hal Ehwal Agama Islam ${state}.\n\nSekiranya ada perceraian sebelum ini, sijil cerai asal perlu turut disertakan.`,
        },
        {
          heading: "Dokumen anak-anak",
          body: `Senaraikan semua anak di bawah tanggungan pemohon beserta salinan sijil kelahiran masing-masing. Ini termasuk anak-anak daripada perkahwinan semasa mahupun perkahwinan lalu.\n\nJika terdapat anak angkat yang didaftarkan secara rasmi, sijil pengangkatan juga perlu disertakan. ${court} memerlukan gambaran penuh tentang tanggungan pemohon pada masa ini.`,
        },
        {
          heading: "Surat persetujuan isteri pertama",
          body: `Walaupun persetujuan isteri pertama bukan syarat mutlak di sisi undang-undang, ${court} sangat menggalakkan pemohon mendapatkan persetujuan bertulis isteri pertama.\n\nSurat persetujuan ini, jika ada, akan menjadi faktor yang meringankan semasa perbicaraan. Sebaliknya, tentangan isteri pertama boleh menjadi faktor memberatkan yang perlu dijawab pemohon secara terperinci di hadapan Hakim Syarie.`,
        },
      ],
    },
    {
      num: "04",
      label: "Dapatkan nasihat peguam syarie",
      sections: [
        {
          heading: "Kepentingan peguam syarie",
          body: `Proses permohonan poligami di ${court} melibatkan prosedur undang-undang yang kompleks. Peguam Syarie yang berdaftar dengan Majlis Agama Islam ${state} boleh membantu anda menyediakan afidavit, surat akuan, dan hujah-hujah undang-undang yang kukuh.\n\nTanpa representasi undang-undang yang baik, permohonan yang lemah dari segi penyediaan dokumen boleh ditolak walaupun pemohon memenuhi syarat-syarat asas.`,
        },
        {
          heading: "Cara mencari peguam syarie",
          body: `Hubungi Jabatan Hal Ehwal Agama Islam ${state} (JAIS / JAKIM cawangan ${state}) untuk mendapatkan senarai Peguam Syarie berdaftar di negeri ini.\n\nAnda juga boleh menghubungi:\n• Majlis Agama Islam ${state}\n• Bar Syarie Malaysia (www.barsyarie.org.my)\n• Klinik Guaman Pro Bono (jika layak)\n\nPastikan peguam yang dilantik mempunyai pengalaman dalam kes keluarga Islam di ${state} khususnya.`,
        },
        {
          heading: "Kos dan jangka masa",
          body: `Kos guaman bergantung kepada kerumitan kes, namun lazimnya antara RM 1,500 hingga RM 5,000 untuk permohonan biasa di ${court}. Bayaran ini tidak termasuk fi mahkamah dan kos terjemahan dokumen.\n\nJangka masa keseluruhan proses, dari pemfailan hingga keputusan, biasanya mengambil masa 3 hingga 6 bulan. Faktor yang mempercepatkan proses ialah kesempurnaan dokumen dan ketepatan hadir ke semua sebutan mahkamah.`,
        },
      ],
    },
  ];
}

// ─── Legal Checklist Screen ─────────────────────────────────────────────────

function LegalChecklistScreen({
  onNext,
  onBack,
  state,
  sectionsDone,
  onSectionsDone,
  onOpenItem,
}: {
  onNext: () => void;
  onBack: () => void;
  state: string;
  sectionsDone: boolean[][];
  onSectionsDone: (updated: boolean[][]) => void;
  onOpenItem: (idx: number) => void;
}) {
  const items = getChecklistContent(state);

  const itemDone = (i: number) =>
    (sectionsDone[i] ?? []).length > 0 && (sectionsDone[i] ?? []).every(Boolean);

  const itemUnlocked = (i: number) =>
    i === 0 || itemDone(i - 1);

  const completedCount = items.filter((_, i) => itemDone(i)).length;

  return (
    <div className="flex flex-col h-full px-6 py-8 bg-white overflow-y-auto">
      <header className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-black">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <span className="font-serif text-lg">poligami.my</span>
        <span className="border border-gray-300 rounded-full px-3 py-1 text-xs tracking-[0.1em] uppercase">
          {state}
        </span>
      </header>

      <div className="mb-6">
        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-2">Panduan Umum</p>
        <h1 className="font-serif text-4xl font-normal leading-tight mb-3">
          Langkah sebelum<br />proses rasmi.
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Senarai ini ialah panduan umum dan bukan<br />keputusan Mahkamah Syariah.
        </p>
        <div className="mt-4 border border-gray-200 rounded-xl px-4 py-3">
          <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400 mb-1">Maklumat tambahan {state}</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            {state === "Kelantan" || state === "Terengganu"
              ? `${state} menitikberatkan persetujuan isteri sedia ada dan kehadiran di Mahkamah Syariah negeri. Sediakan afidavit lengkap sebelum pemfailan.`
              : state === "Sabah" || state === "Sarawak"
              ? `Prosedur di ${state} merujuk Enakmen keluarga Islam negeri dan mungkin melibatkan pejabat agama daerah. Semak fi dan borang tempatan.`
              : `Rujuk Enakmen Undang-undang Keluarga Islam ${state} dan ${`Mahkamah Syariah ${state}`} untuk borang, fi, dan tarikh sebutan semasa.`}
          </p>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="absolute left-[18px] top-5 bottom-5 w-px bg-gray-100 z-0" />
        <div className="flex flex-col gap-3">
          {items.map((item, i) => {
            const done = itemDone(i);
            const unlocked = itemUnlocked(i);
            const active = unlocked && !done;
            const sectionsTotal = item.sections.length;
            const sectionsDoneCount = (sectionsDone[i] ?? new Array(sectionsTotal).fill(false)).filter(Boolean).length;

            return (
              <div key={i} className="flex items-center gap-4 relative z-10">
                <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  done ? "bg-black border-black" : active ? "bg-white border-black" : "bg-white border-gray-300"
                }`}>
                  {done && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {active && <div className="w-3 h-3 rounded-full bg-black" />}
                  {!unlocked && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  )}
                </div>

                <button
                  disabled={!unlocked}
                  onClick={() => unlocked && onOpenItem(i)}
                  className={`flex-1 flex items-center justify-between border rounded-xl px-4 py-4 transition-all text-left ${
                    done ? "border-gray-200 bg-gray-50" : active ? "border-black" : "border-gray-200 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className={`font-serif text-xl shrink-0 ${!unlocked ? "text-gray-400" : "text-black"}`}>
                      {item.num}
                    </span>
                    <div className="w-px h-5 bg-gray-200 shrink-0" />
                    <div className="min-w-0">
                      <p className={`text-sm font-medium leading-snug ${!unlocked ? "text-gray-400" : "text-black"}`}>
                        {item.label}
                      </p>
                      {unlocked && !done && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {sectionsDoneCount}/{sectionsTotal} bahagian selesai
                        </p>
                      )}
                      {done && (
                        <p className="text-xs text-gray-400 mt-0.5">Selesai dibaca ✓</p>
                      )}
                    </div>
                  </div>
                  {!unlocked ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" className="shrink-0">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 shrink-0">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-b border-gray-100 py-3 mb-5 text-center">
        <span className="text-sm tracking-[0.1em] uppercase text-gray-500">
          <span className="text-black font-semibold">{completedCount}</span> daripada 4 selesai
        </span>
      </div>

      <button
        onClick={onNext}
        disabled={completedCount < 4}
        className="w-full bg-black text-white rounded-full py-4 flex items-center justify-center gap-3 font-medium hover:bg-gray-900 transition-colors mb-4 disabled:opacity-40"
      >
        Teruskan ke pengesahan
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      <button className="text-center text-sm underline underline-offset-2 text-gray-600">
        Lihat sumber rasmi
      </button>
    </div>
  );
}

// ─── Checklist Detail Screen ─────────────────────────────────────────────────

function ChecklistDetailScreen({
  itemIndex,
  state,
  sectionsDone,
  onSectionTick,
  onBack,
}: {
  itemIndex: number;
  state: string;
  sectionsDone: boolean[];
  onSectionTick: (sectionIdx: number) => void;
  onBack: () => void;
}) {
  const items = getChecklistContent(state);
  const item = items[itemIndex];
  const allDone = sectionsDone.every(Boolean);
  const [openSection, setOpenSection] = useState<number | null>(
    sectionsDone.findIndex(d => !d) >= 0 ? sectionsDone.findIndex(d => !d) : null
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* sticky header */}
      <div className="sticky top-0 bg-white z-10 px-6 pt-8 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="text-black">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <span className="font-serif text-lg">poligami.my</span>
          <span className="border border-gray-300 rounded-full px-3 py-1 text-xs tracking-[0.1em] uppercase">
            {state}
          </span>
        </div>
        <div className="flex gap-1">
          {item.sections.map((_, i) => (
            <div key={i} className={`h-0.5 flex-1 rounded-full transition-all ${sectionsDone[i] ? "bg-black" : "bg-gray-200"}`} />
          ))}
        </div>
      </div>

      <div className="px-6 pt-6 pb-4">
        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-1">
          Langkah {item.num} daripada 04
        </p>
        <h1 className="font-serif text-3xl font-normal leading-tight mb-1">{item.label}</h1>
        <p className="text-xs text-gray-400">
          {sectionsDone.filter(Boolean).length} / {item.sections.length} bahagian selesai
        </p>
      </div>

      <div className="px-6 pb-10 flex flex-col gap-6">
        {item.sections.map((section, si) => {
          const isUnlocked = si === 0 || sectionsDone[si - 1];
          const isDone = sectionsDone[si];

          return (
            <div
              key={si}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isDone ? "border-gray-200 bg-gray-50" : isUnlocked ? "border-black" : "border-gray-200 opacity-40"
              }`}
            >
              {/* section header — clickable to toggle when unlocked */}
              <button
                onClick={() => isUnlocked && setOpenSection(openSection === si ? null : si)}
                disabled={!isUnlocked}
                className={`w-full flex items-center justify-between px-5 py-4 text-left ${isDone ? "bg-gray-50" : isUnlocked ? "bg-black" : "bg-white"}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-serif text-lg shrink-0 ${isDone ? "text-gray-400" : isUnlocked ? "text-white" : "text-gray-400"}`}>
                    {String(si + 1).padStart(2, "0")}
                  </span>
                  <div className={`w-px h-5 shrink-0 ${isDone ? "bg-gray-300" : isUnlocked ? "bg-white/30" : "bg-gray-200"}`} />
                  <span className={`text-sm font-medium leading-snug ${isDone ? "text-gray-500" : isUnlocked ? "text-white" : "text-gray-400"}`}>
                    {section.heading}
                  </span>
                </div>
                <div className="shrink-0 ml-2">
                  {isDone && (
                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                  )}
                  {!isUnlocked && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  )}
                  {isUnlocked && !isDone && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className={`transition-transform ${openSection === si ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9" /></svg>
                  )}
                  {isDone && openSection !== si && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><polyline points="6 9 12 15 18 9" /></svg>
                  )}
                </div>
              </button>

              {/* section body — visible when open */}
              {isUnlocked && openSection === si && (
                <div className="px-5 pt-4 pb-5">
                  {section.body.split("\n\n").map((para, pi) => (
                    <p key={pi} className={`text-sm leading-relaxed mb-3 last:mb-0 ${isDone ? "text-gray-500" : "text-gray-800"}`}>
                      {para}
                    </p>
                  ))}

                  <div className="flex gap-2 mt-4">
                    {!isDone && (
                      <button
                        onClick={() => { onSectionTick(si); setOpenSection(si + 1 < item.sections.length ? si + 1 : null); }}
                        className="flex-1 flex items-center justify-center gap-2 bg-black text-white rounded-full py-3 text-xs font-medium tracking-[0.15em] uppercase hover:bg-gray-900 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                        Saya faham — teruskan
                      </button>
                    )}
                    <button
                      onClick={() => setOpenSection(null)}
                      className={`flex items-center justify-center gap-1 border border-gray-200 rounded-full py-3 text-xs text-gray-500 hover:bg-gray-50 transition-colors ${isDone ? "flex-1" : "px-4"}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      {isDone ? "Tutup seksyen" : "Tutup seksyen"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {allDone && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-black">Semua bahagian selesai</p>
              <p className="text-xs text-gray-500 mt-0.5">Anda boleh kembali ke senarai semak</p>
            </div>
          </div>
        )}

        <button
          onClick={onBack}
          className={`w-full rounded-full py-4 text-sm font-medium tracking-wide transition-colors ${
            allDone ? "bg-black text-white hover:bg-gray-900" : "border border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {allDone ? "Kembali ke senarai ✓" : "Kembali ke senarai"}
        </button>
      </div>
    </div>
  );
}

function IdentityVerificationScreen({ onNext, onBack, onSkip }: { onNext: () => void; onBack: () => void; onSkip?: () => void }) {
  return (
    <div className="flex flex-col h-full px-6 py-8 bg-white overflow-y-auto">
      <header className="flex items-center justify-between mb-1">
        <button onClick={onBack} className="text-black">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <span className="font-serif text-lg">poligami.my</span>
        <div className="w-5" />
      </header>
      <ProgressBar current={5} total={6} />

      <div className="mt-8 mb-6">
        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-2">Pengesahan Identiti</p>
        <h1 className="font-serif text-4xl font-normal leading-tight mb-3">
          Bina kepercayaan<br />dengan semakan.
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Pengesahan membantu memastikan setiap ahli<br />menggunakan identiti yang sah.
        </p>
      </div>

      {/* MyKad illustration */}
      <div className="border-2 border-gray-300 rounded-2xl p-5 mb-6 flex gap-4">
        <div className="w-20 h-24 bg-gray-200 rounded flex items-center justify-center shrink-0">
          <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
            <circle cx="18" cy="12" r="9" fill="#6b7280" />
            <ellipse cx="18" cy="36" rx="15" ry="10" fill="#6b7280" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[10px] tracking-[0.1em] uppercase font-medium text-gray-700">Kad Pengenalan</p>
              <p className="text-[10px] tracking-[0.1em] uppercase font-medium text-gray-700">Malaysia</p>
            </div>
            <div className="w-8 h-8 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="#9ca3af" strokeWidth="1" />
                <circle cx="20" cy="20" r="14" fill="#d1d5db" />
                <path d="M8 30 Q20 10 32 30" fill="#9ca3af" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            {[80, 60, 45, 55].map((w, i) => (
              <div key={i} className="flex gap-2 items-center">
                <div className={`h-2 bg-gray-200 rounded`} style={{ width: `${w}%` }} />
                {i >= 2 && <div className="h-2 bg-gray-200 rounded w-8" />}
              </div>
            ))}
          </div>
          <div className="mt-3 ml-auto w-12 h-9 border border-gray-300 rounded grid grid-cols-3 gap-px p-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-sm" />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-5">
        {[
          { icon: "id", label: "Kad pengenalan diperlukan" },
          { icon: "clock", label: "Semakan mengambil 1–2 hari bekerja" },
          { icon: "lock", label: "Dokumen tidak dipaparkan kepada ahli lain" },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center shrink-0">
              {icon === "id" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <circle cx="8" cy="12" r="2" />
                  <line x1="13" y1="10" x2="19" y2="10" />
                  <line x1="13" y1="14" x2="19" y2="14" />
                </svg>
              )}
              {icon === "clock" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              )}
              {icon === "lock" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-700">{label}</span>
          </div>
        ))}
      </div>

      <div className="border border-gray-200 rounded-xl flex items-center gap-3 px-4 py-3 mb-6">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-gray-500">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
        <div className="w-px h-5 bg-gray-200" />
        <p className="text-[10px] tracking-[0.15em] uppercase text-gray-500">
          Disemak untuk kepercayaan platform sahaja
        </p>
      </div>

      <button
        onClick={onNext}
        className="w-full bg-black text-white rounded-full py-4 text-base font-medium hover:bg-gray-900 transition-colors mb-3"
      >
        Mulakan pengesahan
      </button>
    </div>
  );
}

// ─── Upload validation ────────────────────────────────────────────────────────

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/heic", "image/heif", "image/webp"];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

type UploadState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "ok"; preview: string; dataUrl: string; name: string; sizeMb: string };

function validateFile(file: File): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const allowedExt = ["jpg", "jpeg", "png", "heic", "heif", "webp"];
  const typeOk = ALLOWED_TYPES.includes(file.type) || allowedExt.includes(ext);
  if (!typeOk) {
    return `Jenis fail tidak disokong. Sila gunakan JPG, PNG, atau HEIC.`;
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `Fail terlalu besar (${(file.size / 1024 / 1024).toFixed(1)} MB). Had maksimum ialah ${MAX_SIZE_MB} MB.`;
  }
  return null;
}

function UploadZone({
  label,
  side,
  state,
  onChange,
}: {
  label: string;
  side: "front" | "back";
  state: UploadState;
  onChange: (s: UploadState) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const err = validateFile(file);
    if (err) {
      onChange({ status: "error", message: err });
      return;
    }
    const dataUrl = await db.fileToDataUrl(file);
    onChange({
      status: "ok",
      preview: dataUrl,
      dataUrl,
      name: file.name,
      sizeMb: (file.size / 1024 / 1024).toFixed(2),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const isOk = state.status === "ok";
  const isErr = state.status === "error";

  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/heif,image/webp"
        className="hidden"
        onChange={handleChange}
      />

      <div
        onClick={() => ref.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`relative flex items-center gap-4 border-2 border-dashed rounded-2xl px-5 py-5 cursor-pointer transition-all select-none ${
          isOk
            ? "border-black bg-gray-50"
            : isErr
            ? "border-red-400 bg-red-50"
            : "border-gray-300 hover:border-gray-500 hover:bg-gray-50 active:bg-gray-100"
        }`}
      >
        {/* thumbnail / icon */}
        {isOk && state.status === "ok" ? (
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
            <img src={state.preview} alt="preview" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${isErr ? "bg-red-100" : "bg-gray-100"}`}>
            {isErr ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            )}
          </div>
        )}

        {/* text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-black">{label}</p>
          {isOk && state.status === "ok" && (
            <>
              <p className="text-xs text-gray-500 mt-0.5 truncate">{state.name}</p>
              <p className="text-xs text-gray-400">{state.sizeMb} MB · Dimuat naik ✓</p>
            </>
          )}
          {isErr && state.status === "error" && (
            <p className="text-xs text-red-500 mt-0.5 leading-snug">{state.message}</p>
          )}
          {state.status === "idle" && (
            <p className="text-xs text-gray-400 mt-0.5">Ketik untuk pilih fail</p>
          )}
        </div>

        {/* right badge */}
        {isOk && (
          <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
        {isOk && (
          <button
            onClick={(e) => { e.stopPropagation(); onChange({ status: "idle" }); }}
            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            title="Buang fail"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function UploadDocumentsScreen({ onBack, onDone }: { onBack: () => void; onDone: (docs: { front: string; back: string }) => void }) {
  const [front, setFront] = useState<UploadState>({ status: "idle" });
  const [back, setBack] = useState<UploadState>({ status: "idle" });

  const bothReady = front.status === "ok" && back.status === "ok";
  const [submitted, setSubmitted] = useState(false);

  const requirements = [
    { pass: true, label: "Jenis fail: JPG, PNG, atau HEIC" },
    { pass: true, label: `Saiz maksimum: ${MAX_SIZE_MB} MB setiap fail` },
    { pass: front.status === "ok", label: "Bahagian hadapan MyKad dimuat naik" },
    { pass: back.status === "ok", label: "Bahagian belakang MyKad dimuat naik" },
  ];

  return (
    <div className="flex flex-col h-full px-6 py-8 bg-white overflow-y-auto">
      <header className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-black">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <span className="text-xs tracking-[0.2em] uppercase text-gray-500">Poligami.My</span>
        <div className="w-5" />
      </header>

      <div className="text-center mb-1">
        <p className="text-xs tracking-[0.15em] text-gray-500 uppercase">Langkah 1 / 2</p>
      </div>
      <ProgressBar current={1} total={2} />

      <div className="mt-8 mb-6">
        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-2">Muat Naik Dokumen</p>
        <h1 className="font-serif text-4xl font-normal leading-tight mb-3">
          Sediakan dokumen anda.
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Pastikan imej jelas dan semua penjuru<br />dokumen kelihatan.
        </p>
      </div>

      {/* upload zones */}
      <div className="flex flex-col gap-3 mb-6">
        <UploadZone label="Bahagian hadapan MyKad" side="front" state={front} onChange={setFront} />
        <UploadZone label="Bahagian belakang MyKad" side="back" state={back} onChange={setBack} />
      </div>

      {/* syarat */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-xs tracking-[0.15em] uppercase text-gray-500 font-medium">Syarat Muat Naik</p>
        </div>
        {requirements.map(({ pass, label }, i) => (
          <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < requirements.length - 1 ? "border-b border-gray-100" : ""}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${pass ? "bg-black" : "bg-gray-100"}`}>
              {pass ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              )}
            </div>
            <span className={`text-xs ${pass ? "text-black" : "text-gray-400"}`}>{label}</span>
          </div>
        ))}
      </div>

      {/* tips */}
      <div className="mb-6">
        <p className="text-xs tracking-[0.15em] uppercase text-gray-500 mb-3">Tip Muat Naik</p>
        <div className="flex flex-col">
          {[
            {
              label: "Cahaya mencukupi",
              sub: "Ambil gambar di bawah cahaya semula jadi atau lampu terang",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                </svg>
              ),
            },
            {
              label: "Tiada pantulan",
              sub: "Elakkan kilat kamera dan permukaan berkilat",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="23 6 13 16 8 11 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              ),
            },
            {
              label: "Semua penjuru kelihatan",
              sub: "Pastikan keempat-empat sudut kad tidak terpotong",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              ),
            },
            {
              label: "Maklumat boleh dibaca",
              sub: "Teks dan nombor kad mesti jelas dan tidak kabur",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="21" y1="10" x2="7" y2="10" /><line x1="21" y1="6" x2="3" y2="6" />
                  <line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="7" y2="18" />
                </svg>
              ),
            },
          ].map(({ label, sub, icon }, i, arr) => (
            <div key={label} className={`flex items-start gap-4 py-3.5 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}>
              <div className="w-8 h-8 flex items-center justify-center shrink-0 text-gray-500 mt-0.5">
                {icon}
              </div>
              <div>
                <p className="text-sm font-medium text-black">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* privacy note */}
      <div className="border border-gray-200 rounded-xl flex items-center gap-3 px-4 py-3 mb-5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 shrink-0">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="text-xs text-gray-500">Fail disulitkan dan tidak dipaparkan kepada ahli lain.</span>
      </div>

      <button
        disabled={!bothReady}
        onClick={() => bothReady && setSubmitted(true)}
        className={`w-full rounded-full py-4 text-xs font-medium tracking-[0.2em] uppercase transition-colors mb-3 ${
          bothReady ? "bg-black text-white hover:bg-gray-900 cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Hantar Untuk Semakan
      </button>
      <button onClick={onBack} className="text-center text-xs tracking-[0.15em] uppercase underline underline-offset-2 text-gray-500">
        Simpan & Keluar
      </button>

      {/* success overlay */}
      {submitted && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mb-8">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">Dokumen dihantar</p>
          <h2 className="font-serif text-4xl font-normal leading-tight mb-5">
            Sedang dalam<br />semakan.
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-10">
            Pasukan kami akan menyemak dokumen anda<br />dalam masa <strong className="text-black">1–2 hari bekerja.</strong><br />
            Anda akan dimaklumkan melalui e-mel.
          </p>
          <div className="w-full border border-gray-200 rounded-2xl px-5 py-4 flex items-center gap-3 mb-8">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 shrink-0">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-xs text-gray-500">Dokumen tidak akan dikongsi dengan ahli lain.</span>
          </div>
          <button
            onClick={() => {
              if (front.status === "ok" && back.status === "ok") onDone({ front: front.dataUrl, back: back.dataUrl });
            }}
            className="w-full bg-black text-white rounded-full py-4 text-sm font-medium hover:bg-gray-900 transition-colors"
          >
            Pergi ke log masuk
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Bottom Nav ──────────────────────────────────────────────────────────────

type NavTab = "ruang" | "explore" | "feed" | "chat" | "profil";

function BottomNav({ active, onGo, unreadChat = 0 }: { active: NavTab; onGo: (t: NavTab) => void; unreadChat?: number }) {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "ruang", label: "RUANG",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
    },
    {
      id: "explore", label: "EXPLORE",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    },
    {
      id: "feed", label: "FEED",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    },
    {
      id: "chat", label: "CHAT",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    },
    {
      id: "profil", label: "PROFIL",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    },
  ];
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-100 flex" style={{ paddingBottom: "var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px))" }}>
      {tabs.map(({ id, label, icon }) => (
        <button key={id} onClick={() => onGo(id)} className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors relative ${active === id ? "text-black" : "text-gray-400"}`}>
          <div className="relative">
            {icon}
            {id === "chat" && unreadChat > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-black text-white text-[8px] flex items-center justify-center font-bold">{unreadChat}</span>
            )}
          </div>
          <span className="text-[8px] tracking-[0.12em] font-medium">{label}</span>
          {active === id && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-black rounded-full" />}
        </button>
      ))}
    </div>
  );
}

// ─── 11. Photo Privacy ───────────────────────────────────────────────────────

function PhotoPrivacyScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [privacy, setPrivacy] = useState<"blur" | "consent" | "none">("blur");
  const [allowRequest, setAllowRequest] = useState(true);

  return (
    <div className="flex flex-col h-full px-6 py-8 bg-white overflow-y-auto">
      <header className="flex items-center justify-between mb-1">
        <button onClick={onBack} className="text-black">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
        </button>
        <span className="font-serif text-lg">poligami.my</span>
        <div className="w-5" />
      </header>
      <ProgressBar current={6} total={6} />

      <div className="mt-8 mb-6">
        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-2">Foto & Persetujuan</p>
        <h1 className="font-serif text-4xl font-normal leading-tight mb-2">Anda menentukan<br />siapa yang melihat.</h1>
      </div>

      {/* blurred avatar preview */}
      <div className="flex justify-center mb-8">
        <div className="relative w-36 h-36 rounded-full overflow-hidden bg-gray-200">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-400" style={{ filter: privacy === "blur" ? "blur(8px)" : "none", transform: "scale(1.1)" }}>
            <svg width="100%" height="100%" viewBox="0 0 144 144" fill="none">
              <circle cx="72" cy="48" r="28" fill="#9ca3af" />
              <ellipse cx="72" cy="110" rx="42" ry="28" fill="#9ca3af" />
            </svg>
          </div>
          {privacy === "blur" && (
            <div className="absolute inset-0 flex items-end justify-center pb-4">
              <span className="text-white text-[10px] tracking-[0.2em] font-medium bg-black/40 px-3 py-1 rounded-full">DIKABURKAN</span>
            </div>
          )}
          {privacy === "none" && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-5">
        {([
          { val: "blur" as const, label: "Kabur secara lalai" },
          { val: "consent" as const, label: "Tunjuk selepas persetujuan bersama" },
          { val: "none" as const, label: "Jangan paparkan foto" },
        ]).map(({ val, label }) => (
          <button key={val} onClick={() => setPrivacy(val)} className={`flex items-center gap-4 border rounded-xl px-5 py-4 transition-all ${privacy === val ? "border-black" : "border-gray-200"}`}>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${privacy === val ? "border-black" : "border-gray-300"}`}>
              {privacy === val && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
            </div>
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between border border-gray-200 rounded-xl px-5 py-4 mb-3">
        <span className="text-sm text-black">Benarkan permintaan buka foto</span>
        <button onClick={() => setAllowRequest(!allowRequest)} className={`w-12 h-6 rounded-full transition-colors relative ${allowRequest ? "bg-black" : "bg-gray-300"}`}>
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${allowRequest ? "left-6" : "left-0.5"}`} />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-8">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
        <span className="text-xs text-gray-400">Anda boleh menarik semula persetujuan pada bila-bila masa.</span>
      </div>

      <button onClick={onNext} className="w-full bg-black text-white rounded-full py-4 text-base font-medium hover:bg-gray-900 transition-colors">
        Simpan tetapan
      </button>
    </div>
  );
}

// ─── 12. Trust Gate Dashboard ────────────────────────────────────────────────

const TRUST_STEPS = [
  { num: 1, label: "E-mel disahkan", sub: "SELESAI", done: true, pending: false },
  { num: 2, label: "Status diisytihar", sub: "SELESAI", done: true, pending: false },
  { num: 3, label: "Pengesahan identiti", sub: "DALAM SEMAKAN", done: false, pending: true },
  { num: 4, label: "Foto & persetujuan", sub: "SELESAI", done: true, pending: false },
];

function CircleProgress({ pct }: { pct: number }) {
  const r = 72; const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      <circle cx="90" cy="90" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
      <circle cx="90" cy="90" r={r} fill="none" stroke="black" strokeWidth="8"
        strokeDasharray={`${dash} ${c}`} strokeDashoffset={c * 0.25} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }} />
      <text x="90" y="90" textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 36, fill: "#111" }}>{pct}%</text>
    </svg>
  );
}

function TrustGateDashboard({ onProfile, onNavGo, onStatusSemakan }: { onProfile: () => void; onNavGo: (t: NavTab) => void; onStatusSemakan: () => void }) {
  const done = TRUST_STEPS.filter(s => s.done).length;
  const pct = Math.round((done / TRUST_STEPS.length) * 100);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 px-6 pt-8 pb-4 overflow-y-auto">
        <header className="flex items-center justify-between mb-6">
          <span className="font-serif text-2xl">poligami.my</span>
          <button onClick={() => onNavGo("profil")} className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </button>
        </header>
        <div className="border-b border-gray-100 mb-6" />

        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-1">Status Ruang</p>
        <h1 className="font-serif text-4xl font-normal leading-tight mb-2">
          {done} daripada {TRUST_STEPS.length} selesai.
        </h1>
        <p className="text-gray-500 text-sm mb-8">Interaksi kekal terkawal sementara semakan dilengkapkan.</p>

        <div className="flex justify-center mb-8">
          <CircleProgress pct={pct} />
        </div>

        <div className="flex flex-col mb-6">
          {TRUST_STEPS.map((step, i) => (
            <div key={i} className={`flex items-center gap-4 py-4 ${i < TRUST_STEPS.length - 1 ? "border-b border-gray-100" : ""}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${step.done ? "bg-black text-white" : step.pending ? "bg-gray-200 text-gray-500" : "bg-gray-100 text-gray-400"}`}>
                {step.num}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-black">{step.label}</p>
                <p className={`text-xs tracking-[0.1em] uppercase mt-0.5 ${step.pending ? "text-gray-400" : "text-gray-400"}`}>{step.sub}</p>
              </div>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${step.done ? "bg-black" : step.pending ? "bg-gray-100" : "bg-gray-100"}`}>
                {step.done
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl flex items-start gap-4 px-5 py-4 mb-6">
          <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><rect x="9" y="9" width="6" height="6" /></svg>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">Safe chat dibuka selepas semua<br />trust gates selesai.</p>
        </div>

        <button onClick={onStatusSemakan} className="w-full bg-black text-white rounded-full py-4 text-xs font-medium tracking-[0.2em] uppercase hover:bg-gray-900 transition-colors mb-2">
          Lihat Status Semakan
        </button>
      </div>

      <BottomNav active="ruang" onGo={onNavGo} />
    </div>
  );
}

// ─── 13. Candidate Profile ───────────────────────────────────────────────────

function CandidateProfileScreen({ onBack, onConsentRequest, onIntroduction }: { onBack: () => void; onConsentRequest: () => void; onIntroduction: () => void }) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="overflow-y-auto flex-1">
        <header className="flex items-center justify-between px-6 py-5">
          <button onClick={onBack} className="text-black">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          </button>
          <span className="font-serif text-lg">poligami.my</span>
          <button className="text-black">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="5" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="19" r="1" fill="currentColor" /></svg>
          </button>
        </header>

        {/* blurred hero photo */}
        <div className="relative mx-6 rounded-2xl overflow-hidden bg-gray-200 h-56 mb-5">
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)", filter: "blur(12px)", transform: "scale(1.1)" }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <svg width="60" height="72" viewBox="0 0 60 72" fill="none">
              <circle cx="30" cy="22" r="16" fill="#6b7280" />
              <ellipse cx="30" cy="58" rx="26" ry="16" fill="#6b7280" />
            </svg>
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <span className="bg-black/60 text-white text-[10px] tracking-[0.2em] px-4 py-1.5 rounded-full">FOTO DIKABURKAN</span>
          </div>
        </div>

        <div className="px-6">
          <div className="flex gap-2 mb-4">
            {[
              { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>, label: "IDENTITI DISEMAK" },
              { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M4 20v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1" /><polyline points="9 12 11 14 15 10" /></svg>, label: "STATUS DIISYTIHAR" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 border border-gray-300 rounded-full px-3 py-1.5">
                {icon}
                <span className="text-[10px] tracking-[0.1em] font-medium">{label}</span>
              </div>
            ))}
          </div>

          <h2 className="font-serif text-5xl font-normal mb-1">Sarah, 34</h2>
          <p className="text-gray-500 text-sm mb-5">Selangor · Profesional</p>
          <div className="border-t border-gray-100" />

          {[
            { label: "TENTANG SAYA", value: "Menghargai komunikasi yang jelas, keluarga dan proses yang tertib." },
            { label: "NIAT", value: "Pengenalan berstruktur" },
            { label: "KESEDIAAN", value: "Legal checklist sedang dilengkapkan" },
          ].map(({ label, value }) => (
            <div key={label} className="py-4 border-b border-gray-100">
              <p className="text-xs tracking-[0.15em] text-gray-500 uppercase mb-1">{label}</p>
              <p className="text-sm text-black leading-relaxed">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-3">
        <button onClick={onConsentRequest} className="w-full border border-black rounded-full py-4 text-xs font-medium tracking-[0.2em] uppercase hover:bg-gray-50 transition-colors">
          Minta Buka Foto
        </button>
        <button onClick={onIntroduction} className="w-full bg-black text-white rounded-full py-4 text-xs font-medium tracking-[0.2em] uppercase hover:bg-gray-900 transition-colors">
          Mulakan Pengenalan
        </button>
      </div>
    </div>
  );
}

// ─── 14. Photo Consent Request ───────────────────────────────────────────────

function PhotoConsentRequestScreen({ onSend, onBack }: { onSend: () => void; onBack: () => void }) {
  const [understood, setUnderstood] = useState(false);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col h-full items-center justify-center px-8 bg-white text-center">
        <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mb-6">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">Permintaan dihantar</p>
        <h2 className="font-serif text-4xl font-normal leading-tight mb-5">Sarah akan<br />dimaklumkan.</h2>
        <p className="text-sm text-gray-500 mb-10 leading-relaxed">Anda akan diberitahu apabila Sarah menerima atau menolak permintaan ini.</p>
        <button onClick={onBack} className="w-full bg-black text-white rounded-full py-4 text-sm font-medium hover:bg-gray-900 transition-colors">
          Kembali ke profil
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-6 py-8 bg-white overflow-y-auto">
      <header className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-black">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
        </button>
        <span className="font-serif text-lg">Poligami.my</span>
        <div className="w-5" />
      </header>

      <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-2 text-center">Persetujuan Foto</p>
      <h1 className="font-serif text-4xl font-normal leading-tight mb-3 text-center">Minta dengan hormat.</h1>
      <p className="text-gray-500 text-sm text-center leading-relaxed mb-8">
        Sarah akan menerima permintaan dan<br />boleh menerima atau menolak tanpa perlu<br />memberi sebab.
      </p>

      {/* two avatars with lock */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center border-2 border-gray-300">
            <svg width="36" height="44" viewBox="0 0 36 44" fill="none"><circle cx="18" cy="14" r="10" fill="white" opacity="0.8" /><ellipse cx="18" cy="36" rx="16" ry="10" fill="white" opacity="0.8" /></svg>
          </div>
          <span className="text-[10px] tracking-[0.15em] text-gray-500">AHMAD</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-px w-8 border-t-2 border-dashed border-gray-300" />
          <div className="w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          </div>
          <div className="h-px w-8 border-t-2 border-dashed border-gray-300" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300" style={{ filter: "blur(4px)" }}>
            <div className="w-full h-full bg-gradient-to-b from-gray-300 to-gray-400" />
          </div>
          <span className="text-[10px] tracking-[0.15em] text-gray-500">SARAH</span>
        </div>
      </div>

      <div className="border border-gray-200 rounded-2xl overflow-hidden mb-6">
        {[
          { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>, label: "Hanya selepas persetujuan bersama" },
          { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.9" /></svg>, label: "Boleh ditarik semula bila-bila masa" },
          { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>, label: "Tidak boleh disimpan atau dikongsi" },
        ].map(({ icon, label }, i, arr) => (
          <div key={label} className={`flex items-center gap-4 px-5 py-4 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}>
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-600">{icon}</div>
            <span className="text-sm text-gray-700">{label}</span>
          </div>
        ))}
      </div>

      <button onClick={() => setUnderstood(!understood)} className="flex items-center gap-3 mb-8">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${understood ? "bg-black border-black" : "border-gray-300"}`}>
          {understood && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
        </div>
        <span className="text-sm text-gray-700">Saya memahami batas ini.</span>
      </button>

      <button onClick={() => understood && setSent(true)} disabled={!understood}
        className={`w-full rounded-full py-4 text-base font-medium mb-3 transition-colors ${understood ? "bg-black text-white hover:bg-gray-900" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
        Hantar permintaan
      </button>
      <button onClick={onBack} className="text-center text-sm underline underline-offset-2 text-gray-500">Batal</button>
    </div>
  );
}

// ─── 15. Structured Introduction ────────────────────────────────────────────

const introQuestions = [
  {
    q: "Apakah tujuan utama anda berada di ruang ini?",
    opts: ["Memahami keserasian secara tertib", "Mendapatkan panduan awal", "Melibatkan keluarga dalam proses"],
  },
  {
    q: "Bagaimana anda menerangkan pendekatan anda dalam proses ini?",
    opts: ["Berhati-hati dan tersusun", "Terbuka dan jujur", "Mengutamakan persetujuan keluarga"],
  },
  {
    q: "Apakah jangkaan anda daripada pengenalan ini?",
    opts: ["Memahami latar belakang sahaja", "Menilai keserasian nilai", "Membincangkan langkah seterusnya"],
  },
];

function StructuredIntroductionScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [notes, setNotes] = useState<string[]>(["", "", ""]);

  const current = introQuestions[step];
  const selected = answers[step];

  const handleNext = () => {
    if (step < introQuestions.length - 1) setStep(step + 1);
    else onNext();
  };

  return (
    <div className="flex flex-col h-full px-6 py-8 bg-white overflow-y-auto">
      <header className="flex items-center justify-between mb-1">
        <button onClick={step === 0 ? onBack : () => setStep(step - 1)} className="text-black">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
        </button>
        <span className="text-xs tracking-[0.2em] uppercase text-gray-500">Poligami.My</span>
        <span className="text-sm text-gray-400"><span className="text-black font-medium">{String(step + 1).padStart(2, "0")}</span> / {String(introQuestions.length).padStart(2, "0")}</span>
      </header>
      <ProgressBar current={step + 1} total={introQuestions.length} />

      <div className="mt-8 mb-6">
        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-2">Pengenalan Berstruktur</p>
        <h1 className="font-serif text-4xl font-normal leading-tight mb-3">Mulakan dengan<br />asas yang jelas.</h1>
        <p className="text-gray-500 text-sm">Jawapan ini dikongsi sebelum safe chat dibuka.</p>
      </div>

      <div className="border border-gray-200 rounded-2xl p-5 mb-5 flex-1">
        <p className="font-serif text-2xl font-normal mb-1 text-gray-400">
          {String(step + 1).padStart(2, "0")}
        </p>
        <p className="text-base font-medium text-black mb-5 leading-snug">{current.q}</p>
        <div className="flex flex-col gap-3">
          {current.opts.map((opt) => (
            <button key={opt} onClick={() => setAnswers(prev => { const n = [...prev]; n[step] = opt; return n; })}
              className={`flex items-center gap-4 rounded-xl px-4 py-3.5 border transition-all ${selected === opt ? "bg-black border-black" : "border-gray-200 hover:border-gray-400"}`}>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected === opt ? "border-white" : "border-gray-300"}`}>
                {selected === opt && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
              </div>
              <span className={`text-sm font-medium ${selected === opt ? "text-white" : "text-black"}`}>{opt}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-2xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-xs tracking-[0.15em] uppercase text-gray-500">Nota Tambahan</p>
          <span className="text-xs text-gray-400">— Pilihan</span>
        </div>
        <textarea
          value={notes[step]}
          onChange={e => { const v = e.target.value.slice(0, 500); setNotes(prev => { const n = [...prev]; n[step] = v; return n; }); }}
          placeholder="Tulis secara ringkas..."
          className="w-full text-sm text-gray-800 placeholder:text-gray-400 resize-none outline-none min-h-[80px] leading-relaxed"
        />
        <p className="text-xs text-gray-400 text-right mt-1">{notes[step].length} / 500</p>
      </div>

      <button onClick={handleNext} disabled={!selected}
        className={`w-full rounded-full py-4 text-xs font-medium tracking-[0.2em] uppercase transition-colors mb-3 ${selected ? "bg-black text-white hover:bg-gray-900" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
        Simpan & Seterusnya
      </button>
      <div className="flex items-center justify-center gap-2">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><rect x="9" y="9" width="6" height="6" /></svg>
        <span className="text-xs text-gray-400">Hanya dikongsi dengan individu yang dipilih.</span>
      </div>
    </div>
  );
}

// ─── 16. Safe Chat ───────────────────────────────────────────────────────────

function SafeChatScreen({ me, peerId, onBack, onReport }: { me: UserProfile; peerId: string; onBack: () => void; onReport: () => void }) {
  const peer = db.getUser(peerId);
  const [messages, setMessages] = useState(() => db.listMessages(me.id, peerId));
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages.length]);

  const send = (text = draft) => {
    const value = text.trim();
    if (!value) return;
    const msg = db.sendMessage(me.id, peerId, value);
    setMessages(prev => [...prev, msg]);
    setDraft("");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-5 py-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={onBack} className="text-black shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
          {peer?.photoUrl
            ? <img src={peer.photoUrl} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-b from-gray-300 to-gray-500" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-black text-sm">{peer?.displayName ?? "Ahli"}</p>
          <div className="flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
            <span className="text-[10px] tracking-[0.15em] uppercase text-gray-400">Trust Gates Selesai</span>
          </div>
        </div>
        <button onClick={onReport} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="5" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="19" r="1" fill="currentColor" /></svg>
        </button>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        <div className="border border-gray-200 rounded-2xl px-5 py-5 flex flex-col items-center gap-2 text-center mb-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
          <p className="text-xs tracking-[0.2em] uppercase font-medium">Safe Chat Dibuka</p>
          <div className="w-8 h-px bg-gray-200" />
          <p className="text-xs text-gray-500 leading-relaxed">Berbual dengan jelas, sopan dan<br />tanpa urusan kewangan.</p>
        </div>

        {messages.length > 0 && (
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[10px] tracking-[0.15em] text-gray-400 uppercase">Hari Ini</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
        )}

        {messages.map((msg) => {
          const fromMe = msg.fromId === me.id;
          return (
            <div key={msg.id} className={`flex flex-col gap-1 ${fromMe ? "items-end" : "items-start"}`}>
              <div className={`max-w-[78%] rounded-2xl px-4 py-3 ${fromMe ? "bg-black text-white rounded-br-sm" : "bg-gray-100 text-black rounded-bl-sm"}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
              <div className="flex items-center gap-1 px-1">
                <span className="text-[10px] text-gray-400">{db.timeAgo(msg.createdAt)}</span>
                {fromMe && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>}
              </div>
            </div>
          );
        })}

        <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-500 shrink-0 mt-0.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          <p className="text-xs text-gray-500 leading-relaxed">Permintaan wang dan pelaburan<br />tidak dibenarkan.</p>
        </div>
      </div>

      {draft.trim() === "" && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {CHAT_SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => send(s)} className="border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
        <button className="text-gray-400 shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
        </button>
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Tulis mesej..."
          className="flex-1 text-sm outline-none placeholder:text-gray-400 bg-gray-50 rounded-full px-4 py-2.5"
        />
        <button onClick={() => send()} disabled={!draft.trim()} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${draft.trim() ? "bg-black" : "bg-gray-200"}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={draft.trim() ? "white" : "#9ca3af"} strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
        </button>
      </div>
    </div>
  );
}

// ─── 17. Report & Safety ────────────────────────────────────────────────────

const reportReasons = [
  "Permintaan wang atau pelaburan",
  "Gangguan atau bahasa tidak sopan",
  "Identiti atau status meragukan",
  "Perkara lain",
];

function ReportSafetyScreen({ onBack }: { onBack: () => void }) {
  const [reason, setReason] = useState(reportReasons[0]);
  const [detail, setDetail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col h-full items-center justify-center px-8 bg-white text-center">
        <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mb-6">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">Laporan dihantar</p>
        <h2 className="font-serif text-4xl font-normal leading-tight mb-5">Terima kasih<br />kerana melapor.</h2>
        <p className="text-sm text-gray-500 mb-10 leading-relaxed">Pasukan keselamatan kami akan menyemak<br />laporan ini dalam masa 24 jam.</p>
        <button onClick={onBack} className="w-full bg-black text-white rounded-full py-4 text-sm font-medium hover:bg-gray-900 transition-colors">Kembali</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-6 py-8 bg-white overflow-y-auto">
      <header className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-black">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
        <span className="text-xs tracking-[0.2em] uppercase text-gray-500">Poligami.My</span>
        <div className="w-5" />
      </header>

      <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-2">Keselamatan</p>
      <h1 className="font-serif text-4xl font-normal leading-tight mb-3">Laporkan sesuatu<br />yang meragukan.</h1>
      <p className="text-gray-500 text-sm mb-6">Laporan anda dirahsiakan dan akan disemak oleh<br />pasukan keselamatan.</p>

      {/* reported user */}
      <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden" style={{ filter: "blur(3px)" }}>
            <div className="w-full h-full bg-gradient-to-b from-gray-300 to-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium">Sarah</p>
            <p className="text-xs text-gray-400">Perbualan aktif</p>
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><polyline points="9 18 15 12 9 6" /></svg>
      </div>

      <p className="text-xs tracking-[0.15em] uppercase text-gray-500 mb-3">Apakah Yang Berlaku?</p>
      <div className="flex flex-col gap-3 mb-6">
        {reportReasons.map((r) => (
          <button key={r} onClick={() => setReason(r)}
            className={`flex items-center gap-4 border rounded-xl px-5 py-4 transition-all ${reason === r ? "bg-black border-black" : "border-gray-200 hover:border-gray-400"}`}>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${reason === r ? "border-white" : "border-gray-300"}`}>
              {reason === r && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
            </div>
            <span className={`text-sm font-medium ${reason === r ? "text-white" : "text-black"}`}>{r}</span>
          </button>
        ))}
      </div>

      <p className="text-xs tracking-[0.15em] uppercase text-gray-500 mb-2">Keterangan Tambahan (Optional)</p>
      <div className="border border-gray-200 rounded-xl px-4 py-3 mb-8 relative">
        <textarea
          value={detail}
          onChange={e => setDetail(e.target.value.slice(0, 500))}
          placeholder="Terangkan secara ringkas..."
          className="w-full text-sm text-gray-800 placeholder:text-gray-400 resize-none outline-none min-h-[90px] leading-relaxed"
        />
        <p className="text-xs text-gray-400 text-right">{detail.length}/500</p>
      </div>

      <button onClick={() => setSubmitted(true)} className="w-full bg-black text-white rounded-full py-4 text-xs font-medium tracking-[0.2em] uppercase hover:bg-gray-900 transition-colors mb-3">
        Hantar Laporan
      </button>
      <button className="w-full border border-gray-300 rounded-full py-4 text-xs font-medium tracking-[0.2em] uppercase hover:bg-gray-50 transition-colors mb-5">
        Sekat Akaun Ini
      </button>
      <div className="flex items-center justify-center gap-2">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        <span className="text-xs text-gray-400">Jika anda dalam bahaya, hubungi pihak berkuasa tempatan.</span>
      </div>
    </div>
  );
}

// ─── 18. Account Settings ────────────────────────────────────────────────────

function AccountSettingsScreen({ me, onNavGo, onGoTo, onLogout, onUpdate }: { me: UserProfile; onBack: () => void; onNavGo: (t: NavTab) => void; onGoTo: (s: Screen) => void; onLogout: () => void; onUpdate: (patch: Partial<UserProfile>) => void }) {
  const trustDone = TRUST_STEPS.filter(s => s.done).length;
  const trustTotal = TRUST_STEPS.length;
  const [showLogout, setShowLogout] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const menuItems: { icon: React.ReactNode; label: string; screen: Screen }[] = [
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>, label: "MAKLUMAT PROFIL", screen: "settings-profil" },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>, label: "PRIVASI & FOTO", screen: "settings-privasi" },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>, label: "DOKUMEN & SEMAKAN", screen: "settings-dokumen" },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>, label: "NOTIFIKASI", screen: "settings-notifikasi" },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>, label: "KESELAMATAN AKAUN", screen: "settings-keselamatan" },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>, label: "PANDUAN UNDANG-UNDANG", screen: "panduan" },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>, label: "BANTUAN & SOKONGAN", screen: "bantuan" },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pt-8 pb-4">
          <div className="mb-6">
            <span className="font-serif text-2xl">Poligami.my</span>
          </div>

          <h1 className="font-serif text-5xl font-normal tracking-tight mb-6">PROFIL</h1>

          {/* profile card */}
          <div className="flex items-center gap-5 mb-6">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                {avatarPreview || me.photoUrl
                  ? <img src={avatarPreview || me.photoUrl || ""} alt="Foto profil" className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gradient-to-b from-gray-300 to-gray-500" />}
              </div>
              <button onClick={() => avatarInputRef.current?.click()} className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              </button>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={async e => {
                const f = e.target.files?.[0];
                if (!f) return;
                const url = await db.fileToDataUrl(f);
                setAvatarPreview(url);
                onUpdate({ photoUrl: url });
              }} />
            </div>
            <div>
              <p className="font-serif text-2xl mb-2">{me.displayName}{me.age ? `, ${me.age}` : ""}</p>
              <div className="flex flex-wrap gap-2">
                <span className="border border-gray-300 rounded-full px-3 py-1 text-[10px] tracking-[0.1em] uppercase">Identiti Disemak</span>
                <span className="border border-gray-300 rounded-full px-3 py-1 text-[10px] tracking-[0.1em] uppercase">{me.state}</span>
              </div>
            </div>
          </div>

          {/* trust gate summary */}
          <div className="border border-gray-200 rounded-2xl px-5 py-4 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
            </div>
            <div className="flex-1">
              <p className="text-xs tracking-[0.15em] uppercase text-gray-400 mb-0.5">Ruang Anda</p>
              <p className="font-serif text-2xl font-normal">{trustDone} / {trustTotal}</p>
              <p className="text-xs tracking-[0.1em] uppercase text-gray-400">Trust Gates Selesai</p>
            </div>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${trustDone === trustTotal ? "bg-black" : "bg-gray-200"}`}>
              {trustDone === trustTotal
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
            </div>
          </div>

          {/* menu */}
          <div className="flex flex-col">
            {menuItems.map(({ icon, label, screen: dest }, i) => (
              <button key={label} onClick={() => onGoTo(dest)} className={`flex items-center justify-between py-4 transition-colors hover:bg-gray-50 -mx-6 px-6 ${i < menuItems.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className="flex items-center gap-4">
                  <div className="w-8 text-gray-500 shrink-0">{icon}</div>
                  <span className="text-xs tracking-[0.15em] font-medium">{label}</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            ))}
          </div>

          <button onClick={() => setShowLogout(true)} className="w-full border border-gray-300 rounded-full py-4 flex items-center justify-center gap-3 text-xs font-medium tracking-[0.15em] uppercase mt-6 mb-4 hover:bg-gray-50 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            Log Keluar
          </button>

          <div className="flex items-center justify-center gap-3 pb-4">
            <button onClick={() => onGoTo("polisi-privasi")} className="text-[10px] text-gray-400 hover:text-gray-600">Polisi Privasi</button>
            <span className="text-gray-300">·</span>
            <button onClick={() => onGoTo("terma-penggunaan")} className="text-[10px] text-gray-400 hover:text-gray-600">Terma Penggunaan</button>
            <span className="text-gray-300">·</span>
            <button onClick={() => onGoTo("padam-akaun")} className="text-[10px] text-red-400 hover:text-red-600">Padam Akaun</button>
          </div>
        </div>
      </div>

      <BottomNav active="profil" onGo={onNavGo} />

      {/* Log Keluar confirmation */}
      {showLogout && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
          <div className="w-full max-w-sm bg-white rounded-t-3xl px-6 pt-6 pb-10">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
            <h2 className="font-serif text-2xl mb-2">Log Keluar?</h2>
            <p className="text-sm text-gray-500 mb-6">Anda perlu log masuk semula untuk mengakses akaun anda.</p>
            <button onClick={onLogout} className="w-full bg-black text-white rounded-full py-4 text-sm font-medium mb-3 hover:bg-gray-900 transition-colors">Ya, Log Keluar</button>
            <button onClick={() => setShowLogout(false)} className="w-full border border-gray-200 rounded-full py-4 text-sm font-medium hover:bg-gray-50 transition-colors">Batal</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Panduan Screen ──────────────────────────────────────────────────────────

const panduanSections = [
  {
    category: "ASAS UNDANG-UNDANG",
    items: [
      {
        title: "Syarat poligami di Malaysia",
        preview: "Permohonan mesti memenuhi syarat 'adil dan perlu' — bukan sekadar keinginan.",
        body: `Di Malaysia, poligami dikawal oleh Enakmen Undang-undang Keluarga Islam setiap negeri. Seksyen berkaitan menetapkan bahawa seseorang lelaki Muslim boleh berkahwin lebih daripada seorang isteri hanya dengan kebenaran Mahkamah Syariah.\n\nMahkamah akan mempertimbangkan sama ada perkahwinan itu:\n• Adil kepada semua pihak yang terlibat\n• Perlu — bukan sekadar keinginan peribadi\n• Pemohon mampu menanggung semua isteri dari segi kewangan dan masa\n\nMahkamah boleh menolak permohonan walaupun isteri tidak membantah jika syarat-syarat ini tidak dipenuhi.`,
      },
      {
        title: "Proses permohonan di Mahkamah Syariah",
        preview: "Dari pemfailan hingga keputusan — biasanya 3 hingga 6 bulan.",
        body: `Proses permohonan melibatkan beberapa peringkat:\n\n1. Pemfailan borang permohonan di Mahkamah Syariah negeri\n2. Pembayaran fi mahkamah\n3. Tarikh sebutan pertama — mahkamah menyemak kelengkapan dokumen\n4. Notis kepada isteri sedia ada — beliau berhak hadir dan memberi pandangan\n5. Perbicaraan penuh — pemohon dan saksi boleh dipanggil\n6. Keputusan mahkamah\n\nJangka masa keseluruhan biasanya 3–6 bulan bergantung kepada beban kes mahkamah dan kelengkapan dokumen.`,
      },
      {
        title: "Perbezaan prosedur mengikut negeri",
        preview: "Setiap negeri mempunyai Enakmen tersendiri — keperluan dokumen berbeza.",
        body: `Walaupun rangka undang-undang adalah sama, setiap negeri mempunyai Enakmen tersendiri dan Mahkamah Syariah yang beroperasi secara bebas.\n\nContoh perbezaan:\n• Selangor: Enakmen Keluarga Islam (Negeri Selangor) 2003\n• Wilayah Persekutuan: Akta Undang-Undang Keluarga Islam (Wilayah-Wilayah Persekutuan) 1984\n• Johor: Enakmen Keluarga Islam Johor 2003\n\nFi mahkamah, format borang, dan prosedur notis kepada isteri boleh berbeza. Rujuk Mahkamah Syariah negeri anda untuk maklumat terkini.`,
      },
    ],
  },
  {
    category: "KEWANGAN & NAFKAH",
    items: [
      {
        title: "Pengiraan nafkah yang adil",
        preview: "Mahkamah menggunakan formula 'adl — keadilan dalam pembahagian masa dan harta.",
        body: `Konsep 'adl (keadilan) dalam Islam bukan bermakna sama rata — ia bermakna saksama mengikut keperluan.\n\nDalam konteks nafkah, mahkamah akan menilai:\n• Pendapatan bersih bulanan pemohon\n• Perbelanjaan semasa isteri pertama dan anak-anak\n• Anggaran perbelanjaan untuk isteri baru\n• Perumahan — adakah boleh disediakan untuk dua keluarga?\n\nPanduan umum: pendapatan bersih mesti sekurang-kurangnya dua kali ganda daripada jumlah nafkah minimum kedua-dua keluarga.`,
      },
      {
        title: "Dokumen kewangan yang diperlukan",
        preview: "Slip gaji, penyata bank, KWSP, dan senarai aset & liabiliti.",
        body: `Dokumen yang perlu disediakan untuk menunjukkan kemampuan kewangan:\n\n✓ Slip gaji 3 bulan terakhir (atau penyata bank 6 bulan jika bekerja sendiri)\n✓ Penyata KWSP terkini\n✓ Penyata cukai pendapatan terkini (Borang BE/B)\n✓ Geran hartanah (jika ada)\n✓ Penyata pinjaman semasa (perumahan, kereta, peribadi)\n✓ Surat pengesahan majikan\n\nSemua dokumen perlu disahkan benar oleh Pesuruhjaya Sumpah.`,
      },
    ],
  },
  {
    category: "PRIVASI & KESELAMATAN",
    items: [
      {
        title: "Bagaimana data anda dilindungi",
        preview: "Enkripsi hujung-ke-hujung, tiada data dikongsi tanpa persetujuan.",
        body: `poligami.my menggunakan langkah-langkah berikut untuk melindungi maklumat anda:\n\n• Enkripsi data semasa penghantaran (TLS 1.3)\n• Dokumen identiti disimpan dalam vault yang dienkripsi secara berasingan\n• Nama penuh dan nombor IC tidak dipaparkan kepada ahli lain\n• Foto dikaburkan secara lalai — hanya terbuka dengan persetujuan bersama\n• Log audit disimpan untuk setiap akses data sensitif\n\nPoligami.my tidak menjual atau berkongsi data dengan pihak ketiga untuk tujuan pemasaran.`,
      },
      {
        title: "Trust Gate — mengapa ia penting",
        preview: "4 peringkat pengesahan memastikan semua ahli adalah tulen dan serius.",
        body: `Trust Gate adalah sistem pengesahan berperingkat yang memastikan setiap ahli di platform ini adalah:\n\n1. Individu sebenar dengan identiti yang sah (eKYC)\n2. Jujur tentang status perkahwinan mereka\n3. Serius tentang niat mereka\n4. Faham tentang privasi foto dan persetujuan\n\nHanya selepas semua 4 peringkat selesai, safe chat dan interaksi penuh dibuka. Ini melindungi semua pihak — lelaki, wanita, dan keluarga yang terlibat.`,
      },
    ],
  },
];

function PanduanScreen({ onNavGo }: { onNavGo: (t: NavTab) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pt-8 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="font-serif text-2xl">Poligami.my</span>
            <div className="w-5" />
          </div>
          <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-1">Pusat Rujukan</p>
          <h1 className="font-serif text-4xl font-normal leading-tight">Panduan &<br />Maklumat.</h1>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">Rujukan undang-undang, kewangan dan privasi untuk membantu anda membuat keputusan yang bijak.</p>
        </div>

        <div className="px-6 pt-6 pb-10">
          {panduanSections.map((section) => (
            <div key={section.category} className="mb-8">
              <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase mb-4 font-medium">{section.category}</p>
              <div className="flex flex-col gap-3">
                {section.items.map((item) => {
                  const key = `${section.category}-${item.title}`;
                  const isOpen = expanded === key;
                  return (
                    <div key={key} className={`border rounded-2xl overflow-hidden transition-all ${isOpen ? "border-black" : "border-gray-200"}`}>
                      <button
                        onClick={() => setExpanded(isOpen ? null : key)}
                        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-black leading-snug">{item.title}</p>
                          {!isOpen && <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.preview}</p>}
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"
                          className={`shrink-0 mt-0.5 transition-transform ${isOpen ? "rotate-90" : ""}`}>
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 border-t border-gray-100">
                          {item.body.split("\n\n").map((para, i) => (
                            <p key={i} className="text-sm text-gray-700 leading-relaxed mt-3">{para}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* disclaimer */}
          <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" className="shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <p className="text-xs text-gray-500 leading-relaxed">
              Maklumat ini adalah panduan umum sahaja dan bukan nasihat undang-undang rasmi. Sila rujuk Peguam Syarie atau Mahkamah Syariah negeri anda untuk keputusan yang mengikat.
            </p>
          </div>
        </div>
      </div>

      <BottomNav active="ruang" onGo={onNavGo} />
    </div>
  );
}

// ─── Verification Status Screen ─────────────────────────────────────────────

type VerifStatus = "selesai" | "dalam-semakan" | "menunggu" | "diperlukan";

const verificationItems: { id: string; title: string; subtitle: string; status: VerifStatus; detail: string; updated: string }[] = [
  {
    id: "email",
    title: "E-mel disahkan",
    subtitle: "E-mel didaftarkan disahkan",
    status: "selesai",
    detail: "ahmad@email.com telah disahkan pada 3 Sep 2026.",
    updated: "3 Sep 2026",
  },
  {
    id: "status",
    title: "Status diisytihar",
    subtitle: "Peranan & status perkahwinan disahkan",
    status: "selesai",
    detail: "Anda telah mengisytiharkan status sebagai Lelaki — Sudah berkahwin.",
    updated: "3 Sep 2026",
  },
  {
    id: "ekyc",
    title: "Pengesahan identiti",
    subtitle: "Semakan MyKad & eKYC",
    status: "dalam-semakan",
    detail: "Dokumen MyKad (hadapan & belakang) telah diterima. Pasukan sedang menjalankan semakan eKYC manual. Proses mengambil masa 1–2 hari bekerja.",
    updated: "4 Sep 2026",
  },
  {
    id: "photo",
    title: "Foto & persetujuan",
    subtitle: "Tetapan privasi foto dimuktamadkan",
    status: "selesai",
    detail: "Foto dikaburkan secara lalai. Permintaan buka foto dibenarkan.",
    updated: "4 Sep 2026",
  },
];

function statusConfig(s: VerifStatus) {
  switch (s) {
    case "selesai":       return { label: "SELESAI",         dot: "bg-black",       text: "text-black",       badge: "bg-black text-white" };
    case "dalam-semakan": return { label: "DALAM SEMAKAN",   dot: "bg-gray-400",    text: "text-gray-500",    badge: "bg-gray-100 text-gray-600" };
    case "menunggu":      return { label: "MENUNGGU",         dot: "bg-gray-300",    text: "text-gray-400",    badge: "bg-gray-50 text-gray-400" };
    case "diperlukan":    return { label: "TINDAKAN PERLU",  dot: "bg-red-400",     text: "text-red-500",     badge: "bg-red-50 text-red-500" };
  }
}

function VerificationStatusIcon({ status }: { status: VerifStatus }) {
  if (status === "selesai") return (
    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
    </div>
  );
  if (status === "dalam-semakan") return (
    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    </div>
  );
  if (status === "menunggu") return (
    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
    </div>
  );
  return (
    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
    </div>
  );
}

function VerificationStatusScreen({ onBack }: { onBack: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const selesai = verificationItems.filter(i => i.status === "selesai").length;
  const total = verificationItems.length;
  const pct = Math.round((selesai / total) * 100);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* header */}
      <div className="sticky top-0 bg-white z-10 px-6 pt-8 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="text-black">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          </button>
          <span className="font-serif text-lg">poligami.my</span>
          <div className="w-5" />
        </div>
        {/* summary bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between mb-1.5">
              <span className="text-xs tracking-[0.15em] uppercase text-gray-500">Status Semakan</span>
              <span className="text-xs font-medium text-black">{selesai}/{total} selesai</span>
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-black rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold">{pct}%</span>
          </div>
        </div>
      </div>

      <div className="px-6 pt-6 pb-10 flex flex-col gap-1">
        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-2">Butiran Semakan</p>

        {/* active alert for pending items */}
        {verificationItems.some(i => i.status === "dalam-semakan") && (
          <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            <div>
              <p className="text-xs font-medium text-black mb-0.5">Semakan sedang dijalankan</p>
              <p className="text-xs text-gray-500 leading-relaxed">Pasukan kami sedang menyemak dokumen anda. Jangka masa: <strong className="text-black">1–2 hari bekerja.</strong> Anda akan dimaklumkan melalui e-mel.</p>
            </div>
          </div>
        )}

        {/* item list */}
        <div className="flex flex-col">
          {verificationItems.map((item, i) => {
            const cfg = statusConfig(item.status);
            const isOpen = expanded === item.id;

            return (
              <div key={item.id} className={`border rounded-2xl mb-3 overflow-hidden transition-all ${isOpen ? "border-black" : "border-gray-200"}`}>
                <button
                  onClick={() => setExpanded(isOpen ? null : item.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                >
                  <VerificationStatusIcon status={item.status} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[9px] tracking-[0.12em] font-medium px-2.5 py-1 rounded-full ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"
                      className={`transition-transform ${isOpen ? "rotate-90" : ""}`}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">{item.detail}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        Dikemaskini: {item.updated}
                      </div>
                      {item.status === "dalam-semakan" && (
                        <span className="text-[10px] tracking-[0.1em] uppercase text-gray-400 animate-pulse">● Sedang diproses</span>
                      )}
                      {item.status === "menunggu" && (
                        <button className="text-xs underline underline-offset-2 text-black font-medium">Lengkapkan →</button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* bottom info */}
        <div className="flex items-start gap-3 border border-gray-200 rounded-2xl px-4 py-4 mt-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 shrink-0 mt-0.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
          <p className="text-xs text-gray-500 leading-relaxed">Safe chat dan interaksi penuh dibuka hanya selepas <strong className="text-black">semua 4 trust gates</strong> selesai disahkan.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Settings Sub-pages ──────────────────────────────────────────────────────

function SettingsBackHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-4 px-6 pt-8 pb-5 border-b border-gray-100 sticky top-0 bg-white z-10">
      <button onClick={onBack} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <h1 className="font-serif text-xl">{title}</h1>
    </div>
  );
}

function SettingsProfilScreen({ me, onBack, onSave }: { me: UserProfile; onBack: () => void; onSave: (patch: Partial<UserProfile>) => void }) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(me.photoUrl);
  const [values, setValues] = useState<Record<string, string>>({
    "NAMA PENUH": me.fullName || me.displayName,
    "NAMA PAPARAN": me.displayName,
    "UMUR": me.age ? String(me.age) : "",
    "LOKASI": me.state,
    "PEKERJAAN": me.occupation,
    "BIO": me.bio || "",
    "NEGERI (CHECKLIST)": me.state,
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);

  const startEdit = (label: string) => { setEditing(label); setDraft(values[label]); };
  const confirmEdit = () => {
    if (editing) setValues(v => ({ ...v, [editing]: draft }));
    setEditing(null);
  };

  const fieldOrder = ["NAMA PENUH", "NAMA PAPARAN", "UMUR", "LOKASI", "PEKERJAAN", "BIO", "NEGERI (CHECKLIST)"];
  const multiline = (label: string) => label === "BIO";

  const persist = () => {
    onSave({
      fullName: values["NAMA PENUH"],
      displayName: values["NAMA PAPARAN"],
      age: parseInt(values["UMUR"]) || me.age,
      state: values["NEGERI (CHECKLIST)"] || values["LOKASI"],
      occupation: values["PEKERJAAN"],
      bio: values["BIO"],
      photoUrl: photoPreview,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <SettingsBackHeader title="Maklumat Profil" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-b from-gray-300 to-gray-500">
              {photoPreview && <img src={photoPreview} alt="Foto profil" className="w-full h-full object-cover" />}
            </div>
            <button onClick={() => photoInputRef.current?.click()} className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:bg-gray-50 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            </button>
            <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={async e => {
              const f = e.target.files?.[0];
              if (f) setPhotoPreview(await db.fileToDataUrl(f));
            }} />
          </div>
          <button onClick={() => photoInputRef.current?.click()} className="text-xs text-gray-400 tracking-[0.1em] hover:text-gray-600 transition-colors">
            {photoPreview ? "TUKAR FOTO" : "TUKAR FOTO PROFIL"}
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {fieldOrder.map(label => (
            <div key={label} className="border-b border-gray-100 pb-4">
              <p className="text-[10px] tracking-[0.2em] text-gray-400 mb-1">{label}</p>
              {editing === label ? (
                <div className="flex flex-col gap-2">
                  {multiline(label)
                    ? <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={3} autoFocus className="w-full text-sm border border-black rounded-xl px-3 py-2 resize-none focus:outline-none leading-relaxed" />
                    : <input value={draft} onChange={e => setDraft(e.target.value)} autoFocus className="w-full text-sm border border-black rounded-xl px-3 py-2 focus:outline-none" />}
                  <div className="flex gap-2">
                    <button onClick={confirmEdit} className="flex-1 bg-black text-white rounded-full py-2 text-xs font-medium tracking-[0.1em]">Simpan</button>
                    <button onClick={() => setEditing(null)} className="flex-1 border border-gray-200 rounded-full py-2 text-xs text-gray-500">Batal</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-gray-900 leading-relaxed">{values[label]}</p>
                  <button onClick={() => startEdit(label)} className="shrink-0 text-[10px] tracking-[0.1em] text-gray-400 border border-gray-200 rounded-full px-3 py-1 hover:border-black hover:text-black transition-colors">EDIT</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button onClick={persist} className="w-full bg-black text-white rounded-full py-4 text-xs font-medium tracking-[0.2em] uppercase mt-8 hover:bg-gray-900 transition-colors">
          {saved ? "✓ Disimpan" : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}

function SettingsPrivasiScreen({ onBack }: { onBack: () => void }) {
  const [blurPhoto, setBlurPhoto] = useState(true);
  const [allowRequests, setAllowRequests] = useState(true);
  const [showLocation, setShowLocation] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className={`w-12 h-6 rounded-full transition-colors relative ${on ? "bg-black" : "bg-gray-200"}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${on ? "left-6" : "left-0.5"}`} />
    </button>
  );

  const rows = [
    { label: "Kaburkan foto secara lalai", sub: "Foto anda dikaburkan untuk semua pengguna", val: blurPhoto, set: () => setBlurPhoto(p => !p) },
    { label: "Benarkan permintaan foto", sub: "Pengguna boleh meminta akses foto anda", val: allowRequests, set: () => setAllowRequests(p => !p) },
    { label: "Tunjukkan lokasi", sub: "Paparkan negeri anda di profil", val: showLocation, set: () => setShowLocation(p => !p) },
    { label: "Profil kelihatan", sub: "Profil anda muncul dalam Explore", val: profileVisible, set: () => setProfileVisible(p => !p) },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <SettingsBackHeader title="Privasi & Foto" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 mb-6 flex items-start gap-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" className="shrink-0 mt-0.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
          <p className="text-xs text-gray-500 leading-relaxed">Foto anda dikaburkan secara lalai untuk melindungi privasi anda. Hanya pengguna yang anda benarkan dapat melihat foto asal.</p>
        </div>
        <div className="flex flex-col divide-y divide-gray-100">
          {rows.map(r => (
            <div key={r.label} className="flex items-center justify-between py-5">
              <div>
                <p className="text-sm font-medium">{r.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{r.sub}</p>
              </div>
              <Toggle on={r.val} onToggle={r.set} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsDokumenScreen({ onBack }: { onBack: () => void }) {
  const docs = [
    { label: "MyKad Hadapan", status: "selesai", updated: "4 Sep 2026" },
    { label: "MyKad Belakang", status: "selesai", updated: "4 Sep 2026" },
    { label: "Pengesahan eKYC", status: "dalam-semakan", updated: "4 Sep 2026" },
  ];
  return (
    <div className="flex flex-col h-full bg-white">
      <SettingsBackHeader title="Dokumen & Semakan" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10">
        <div className="flex flex-col gap-4">
          {docs.map(d => (
            <div key={d.label} className="border border-gray-200 rounded-2xl px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{d.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">Dikemaskini {d.updated}</p>
              </div>
              <span className={`text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full font-medium ${d.status === "selesai" ? "bg-black text-white" : "bg-gray-100 text-gray-500"}`}>
                {d.status === "selesai" ? "Selesai" : "Dalam Semakan"}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-gray-100 pt-6">
          <p className="text-xs tracking-[0.15em] uppercase text-gray-400 mb-4">Muat Naik Semula</p>
          <button className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-8 flex flex-col items-center gap-2 hover:border-gray-400 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <p className="text-xs text-gray-400">Muat naik dokumen baharu</p>
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsNotifikasiScreen({ onBack }: { onBack: () => void }) {
  const [state, setState] = useState({ match: true, chat: true, semakan: true, promo: false, email: true, push: true });
  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className={`w-12 h-6 rounded-full transition-colors relative ${on ? "bg-black" : "bg-gray-200"}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${on ? "left-6" : "left-0.5"}`} />
    </button>
  );
  const sections = [
    { head: "AKTIVITI", rows: [
      { key: "match" as const, label: "Match baharu", sub: "Apabila seseorang match dengan anda" },
      { key: "chat"  as const, label: "Mesej masuk",  sub: "Apabila anda menerima mesej baharu" },
      { key: "semakan" as const, label: "Status semakan", sub: "Kemas kini status verifikasi anda" },
    ]},
    { head: "UMUM", rows: [
      { key: "promo"  as const, label: "Promosi & tawaran", sub: "Diskaun dan kempen khas" },
      { key: "email"  as const, label: "Notifikasi e-mel",  sub: "Hantar notifikasi melalui e-mel" },
      { key: "push"   as const, label: "Notifikasi tolak",  sub: "Pemberitahuan pada peranti anda" },
    ]},
  ];
  return (
    <div className="flex flex-col h-full bg-white">
      <SettingsBackHeader title="Notifikasi" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10">
        {sections.map(s => (
          <div key={s.head} className="mb-8">
            <p className="text-[10px] tracking-[0.2em] text-gray-400 mb-3 font-medium">{s.head}</p>
            <div className="flex flex-col divide-y divide-gray-100">
              {s.rows.map(r => (
                <div key={r.key} className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-medium">{r.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.sub}</p>
                  </div>
                  <Toggle on={state[r.key]} onToggle={() => setState(p => ({ ...p, [r.key]: !p[r.key] }))} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsKeselamatanScreen({ onBack }: { onBack: () => void }) {
  const [show2FA, setShow2FA] = useState(false);
  return (
    <div className="flex flex-col h-full bg-white">
      <SettingsBackHeader title="Keselamatan Akaun" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10">
        <div className="flex flex-col gap-4">
          {[
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, label: "Tukar Kata Laluan", sub: "Kemaskini kata laluan akaun anda" },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>, label: "Pengesahan 2 Langkah", sub: show2FA ? "Diaktifkan" : "Tidak aktif" },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>, label: "Sesi Aktif", sub: "Urus peranti yang log masuk" },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, label: "Log Aktiviti Akaun", sub: "Semak aktiviti log masuk terbaru" },
          ].map(item => (
            <button key={item.label} className="w-full flex items-center gap-4 border border-gray-200 rounded-2xl px-5 py-4 hover:bg-gray-50 transition-colors text-left">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-500">{item.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4">
          <div>
            <p className="text-sm font-medium">Pengesahan 2 Langkah</p>
            <p className="text-xs text-gray-400 mt-0.5">{show2FA ? "Diaktifkan — SMS ke +6012-XXX" : "Tidak aktif"}</p>
          </div>
          <button onClick={() => setShow2FA(p => !p)} className={`w-12 h-6 rounded-full transition-colors relative ${show2FA ? "bg-black" : "bg-gray-200"}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${show2FA ? "left-6" : "left-0.5"}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

function BantuanScreen({ onBack }: { onBack: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const faqs = [
    { q: "Bagaimana proses pendaftaran poligami melalui aplikasi ini?", a: "Proses bermula dengan pendaftaran akaun, diikuti dengan pengesahan identiti, pengisytiharan status, dan melengkapkan legal checklist berdasarkan negeri anda. Setelah semua trust gates selesai, anda boleh memulakan proses pencarian dan perkenalan." },
    { q: "Berapa lama proses pengesahan eKYC mengambil masa?", a: "Proses eKYC biasanya mengambil masa 1–2 hari bekerja. Anda akan dimaklumkan melalui e-mel dan notifikasi aplikasi apabila semakan selesai." },
    { q: "Apakah yang berlaku jika permohonan saya ditolak?", a: "Jika permohonan ditolak, anda akan menerima sebab penolakan melalui e-mel. Anda boleh mengemukakan semula dokumen yang diperlukan atau menghubungi pasukan sokongan untuk panduan lanjut." },
    { q: "Bagaimana foto saya dilindungi?", a: "Foto anda dikaburkan secara lalai. Hanya pengguna yang anda berikan kebenaran secara eksplisit dapat melihat foto asal anda. Anda boleh menarik balik kebenaran pada bila-bila masa." },
    { q: "Bolehkah saya memadamkan akaun saya?", a: "Ya. Pergi ke Profil > Padam Akaun. Semua data anda akan dipadamkan secara kekal dalam masa 30 hari. Proses ini tidak boleh dipulihkan." },
  ];
  return (
    <div className="flex flex-col h-full bg-white">
      <SettingsBackHeader title="Bantuan & Sokongan" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10">
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, label: "Live Chat", sub: "Hari Isnin–Jumaat" },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label: "E-mel", sub: "support@poligami.my" },
          ].map(c => (
            <button key={c.label} className="border border-gray-200 rounded-2xl p-4 flex flex-col gap-2 hover:bg-gray-50 transition-colors text-left">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">{c.icon}</div>
              <p className="text-sm font-medium">{c.label}</p>
              <p className="text-xs text-gray-400">{c.sub}</p>
            </button>
          ))}
        </div>
        <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase mb-4 font-medium">Soalan Lazim</p>
        <div className="flex flex-col gap-3">
          {faqs.map(f => (
            <div key={f.q} className={`border rounded-2xl overflow-hidden transition-all ${expanded === f.q ? "border-black" : "border-gray-200"}`}>
              <button onClick={() => setExpanded(expanded === f.q ? null : f.q)} className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left">
                <p className="text-sm font-medium leading-snug flex-1">{f.q}</p>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" className={`shrink-0 mt-0.5 transition-transform ${expanded === f.q ? "rotate-90" : ""}`}><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              {expanded === f.q && <div className="px-5 pb-5 border-t border-gray-100"><p className="text-sm text-gray-600 leading-relaxed mt-3">{f.a}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PolisiPrivasiScreen({ onBack }: { onBack: () => void }) {
  const sections = [
    { title: "Pengumpulan Maklumat", body: "Kami mengumpul maklumat yang anda berikan semasa pendaftaran termasuk nama, e-mel, nombor telefon, dan dokumen pengenalan diri. Maklumat ini digunakan semata-mata untuk tujuan pengesahan identiti dan pemadanan." },
    { title: "Penggunaan Data", body: "Data anda digunakan untuk menjalankan semakan eKYC, memadankan profil berdasarkan kriteria yang anda tetapkan, dan mematuhi keperluan undang-undang Malaysia." },
    { title: "Perkongsian Data", body: "Kami tidak berkongsi maklumat peribadi anda dengan pihak ketiga tanpa kebenaran anda, kecuali apabila diperlukan oleh undang-undang atau perintah mahkamah." },
    { title: "Keselamatan Data", body: "Semua data disulitkan menggunakan piawaian industri (AES-256). Foto dikaburkan secara lalai dan hanya boleh dilihat dengan kebenaran eksplisit pengguna." },
    { title: "Hak Anda", body: "Anda berhak untuk mengakses, membetulkan, atau memadamkan data peribadi anda pada bila-bila masa. Hubungi kami di privacy@poligami.my untuk sebarang pertanyaan." },
  ];
  return (
    <div className="flex flex-col h-full bg-white">
      <SettingsBackHeader title="Polisi Privasi" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10">
        <p className="text-xs text-gray-400 mb-6">Dikemaskini: 1 September 2026</p>
        {sections.map(s => (
          <div key={s.title} className="mb-6">
            <p className="text-sm font-semibold mb-2">{s.title}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TermaPenggunaanScreen({ onBack }: { onBack: () => void }) {
  const sections = [
    { title: "Syarat Penggunaan", body: "Dengan menggunakan aplikasi ini, anda bersetuju bahawa anda adalah warganegara Malaysia yang beragama Islam, berumur 18 tahun ke atas, dan mempunyai kapasiti undang-undang untuk berkahwin." },
    { title: "Tanggungjawab Pengguna", body: "Anda bertanggungjawab untuk memastikan semua maklumat yang diberikan adalah tepat dan benar. Memberikan maklumat palsu adalah kesalahan dan boleh menyebabkan akaun anda ditangguhkan atau dipadam." },
    { title: "Tingkah Laku Dalam Aplikasi", body: "Pengguna dilarang keras daripada menghantar kandungan yang tidak sesuai, mengganggu pengguna lain, atau menggunakan aplikasi untuk tujuan selain daripada yang dinyatakan." },
    { title: "Penamatan Akaun", body: "Kami berhak untuk menangguhkan atau menamatkan akaun anda tanpa notis jika anda melanggar terma ini. Anda juga boleh memadamkan akaun anda sendiri pada bila-bila masa." },
  ];
  return (
    <div className="flex flex-col h-full bg-white">
      <SettingsBackHeader title="Terma Penggunaan" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10">
        <p className="text-xs text-gray-400 mb-6">Berkuat kuasa: 1 September 2026</p>
        {sections.map(s => (
          <div key={s.title} className="mb-6">
            <p className="text-sm font-semibold mb-2">{s.title}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PadamAkaunScreen({ onBack, onConfirmDelete }: { onBack: () => void; onConfirmDelete: () => void }) {
  const [step, setStep] = useState<"confirm" | "reason" | "final">("confirm");
  const [reason, setReason] = useState("");
  const [typed, setTyped] = useState("");

  if (step === "final") return (
    <div className="flex flex-col h-full bg-white items-center justify-center px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2 className="font-serif text-3xl mb-3">Akaun Dipadamkan</h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-8">Data anda akan dipadamkan sepenuhnya dalam masa 30 hari. Terima kasih kerana menggunakan Poligami.my.</p>
      <button onClick={onConfirmDelete} className="w-full bg-black text-white rounded-full py-4 text-sm font-medium hover:bg-gray-900 transition-colors">Kembali ke Halaman Utama</button>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white">
      <SettingsBackHeader title="Padam Akaun" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10">
        {step === "confirm" && <>
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </div>
          <h2 className="font-serif text-3xl mb-3">Padam Akaun?</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">Tindakan ini <strong>tidak boleh dipulihkan</strong>. Semua data anda termasuk profil, dokumen, dan sejarah padanan akan dipadamkan secara kekal.</p>
          <div className="flex flex-col gap-3 bg-gray-50 rounded-2xl p-5 mb-8">
            {["Profil dan foto anda", "Semua padanan dan chat", "Dokumen yang dimuat naik", "Sejarah verifikasi"].map(item => (
              <div key={item} className="flex items-center gap-3 text-sm text-gray-600">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>
                {item} akan dipadamkan
              </div>
            ))}
          </div>
          <button onClick={() => setStep("reason")} className="w-full bg-red-500 text-white rounded-full py-4 text-sm font-medium mb-3 hover:bg-red-600 transition-colors">Saya Faham, Teruskan</button>
          <button onClick={onBack} className="w-full border border-gray-200 rounded-full py-4 text-sm font-medium hover:bg-gray-50 transition-colors">Batal</button>
        </>}

        {step === "reason" && <>
          <h2 className="font-serif text-2xl mb-6">Kenapa anda ingin pergi?</h2>
          {["Proses terlalu kompleks", "Tidak jumpa padanan yang sesuai", "Sudah berjaya melalui saluran lain", "Privasi saya tidak terjamin", "Sebab lain"].map(r => (
            <button key={r} onClick={() => setReason(r)} className={`w-full flex items-center justify-between border rounded-2xl px-5 py-4 mb-3 transition-colors text-left ${reason === r ? "border-black bg-gray-50" : "border-gray-200 hover:bg-gray-50"}`}>
              <span className="text-sm">{r}</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${reason === r ? "border-black bg-black" : "border-gray-300"}`}>
                {reason === r && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
            </button>
          ))}
          <div className="mt-4 mb-2">
            <p className="text-xs text-gray-500 mb-2">Taip "PADAM" untuk mengesahkan:</p>
            <input value={typed} onChange={e => setTyped(e.target.value)} placeholder="PADAM" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
          </div>
          <button onClick={() => typed === "PADAM" && reason && setStep("final")} className={`w-full rounded-full py-4 text-sm font-medium mt-4 transition-colors ${typed === "PADAM" && reason ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-100 text-gray-400"}`}>
            Padam Akaun Saya
          </button>
        </>}
      </div>
    </div>
  );
}

// ─── Explore / Swipe Data ────────────────────────────────────────────────────

type ExploreCard = { id: string; name: string; age: number; location: string; job: string; bio: string; tags: string[]; photoUrl: string | null; color: string };

function toExploreCard(u: UserProfile): ExploreCard {
  return {
    id: u.id,
    name: u.displayName,
    age: u.age ?? 0,
    location: u.state,
    job: u.occupation,
    bio: u.bio || [u.occupation, u.role].filter(Boolean).join(" · ") || "Ahli poligami.my",
    tags: [u.role, u.state].filter(Boolean),
    photoUrl: u.photoUrl,
    color: "#e5e7eb",
  };
}

// ─── Explore Screen ──────────────────────────────────────────────────────────

function ExploreScreen({
  me, onNavGo, onOpenChat,
}: {
  me: UserProfile;
  onNavGo: (t: NavTab) => void;
  onOpenChat: (id: string) => void;
}) {
  const [dislikedLocal, setDislikedLocal] = useState<string[]>([]);
  const [tick, setTick] = useState(0);
  const remaining = db.listExplore(me.id)
    .filter(u => !dislikedLocal.includes(u.id))
    .map(toExploreCard);
  void tick;

  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const [exiting, setExiting] = useState<"left" | "right" | null>(null);
  const [newMatch, setNewMatch] = useState<ExploreCard | null>(null);

  const current = remaining[0];
  const next = remaining[1];

  const triggerAction = (dir: "left" | "right") => {
    if (!current) return;
    setExiting(dir);
    setTimeout(() => {
      setExiting(null);
      setDragX(0);
      if (dir === "right") {
        const result = db.likeUser(me.id, current.id);
        setTick(n => n + 1);
        if (result.matched) setNewMatch(current);
      } else {
        setDislikedLocal(p => [...p, current.id]);
      }
    }, 350);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => { if (!dragging) return; setDragX(e.clientX - startX.current); };
  const onPointerUp = () => {
    setDragging(false);
    if (Math.abs(dragX) > 80) triggerAction(dragX > 0 ? "right" : "left");
    else setDragX(0);
  };

  const rot = dragX * 0.04;
  const exitX = exiting === "right" ? 400 : exiting === "left" ? -400 : dragX;
  const exitRot = exiting ? (exiting === "right" ? 20 : -20) : rot;
  const likeOpacity = Math.min(1, Math.max(0, dragX / 80));
  const nopeOpacity = Math.min(1, Math.max(0, -dragX / 80));

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 pt-8 pb-3 flex items-center justify-between">
        <h1 className="font-serif text-2xl">Explore</h1>
        <span className="text-xs text-gray-400 tracking-[0.1em]">{remaining.length} profil tersisa</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4 relative overflow-hidden">
        {remaining.length === 0 ? (
          <div className="flex flex-col items-center gap-4 text-center px-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </div>
            <p className="font-serif text-2xl">Tiada profil lagi.</p>
            <p className="text-sm text-gray-500">Profil lain akan muncul selepas ahli lain menyelesaikan pendaftaran pada peranti ini.</p>
          </div>
        ) : (
          <div className="w-full max-w-sm relative" style={{ height: 480 }}>
            {/* next card (behind) */}
            {next && (
              <div className="absolute inset-0 rounded-3xl overflow-hidden" style={{ transform: "scale(0.95) translateY(12px)", zIndex: 0 }}>
                <div className="w-full h-full flex flex-col" style={{ background: next.color }}>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-white/40 flex items-center justify-center">
                      <svg width="48" height="56" viewBox="0 0 48 56" fill="none"><circle cx="24" cy="18" r="13" fill="#9ca3af" /><ellipse cx="24" cy="46" rx="20" ry="12" fill="#9ca3af" /></svg>
                    </div>
                  </div>
                  <div className="px-6 pb-6"><p className="font-serif text-2xl">{next.name}, {next.age}</p></div>
                </div>
              </div>
            )}

            {/* current card (top) */}
            {current && (
              <div
                className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl cursor-grab active:cursor-grabbing select-none"
                style={{
                  zIndex: 1,
                  transform: `translateX(${exitX}px) rotate(${exitRot}deg)`,
                  transition: dragging ? "none" : "transform 0.35s cubic-bezier(.25,.8,.25,1)",
                  background: current.color,
                }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
              >
                {/* SUKA stamp */}
                <div className="absolute top-6 left-6 border-4 border-black rounded-xl px-3 py-1 rotate-[-15deg]" style={{ opacity: likeOpacity }}>
                  <span className="text-black font-bold text-lg tracking-widest">SUKA</span>
                </div>
                {/* PASS stamp */}
                <div className="absolute top-6 right-6 border-4 border-gray-500 rounded-xl px-3 py-1 rotate-[15deg]" style={{ opacity: nopeOpacity }}>
                  <span className="text-gray-500 font-bold text-lg tracking-widest">PASS</span>
                </div>

                {/* blurred photo area */}
                <div className="h-56 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #d1d5db, #9ca3af)", filter: "blur(20px)", transform: "scale(1.2)" }} />
                  <div className="relative z-10 w-24 h-24 rounded-full bg-white/30 flex items-center justify-center">
                    <svg width="48" height="56" viewBox="0 0 48 56" fill="none"><circle cx="24" cy="18" r="13" fill="white" opacity="0.8" /><ellipse cx="24" cy="46" rx="20" ry="12" fill="white" opacity="0.8" /></svg>
                  </div>
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                    <span className="bg-black/50 text-white text-[9px] tracking-[0.2em] px-3 py-1 rounded-full">FOTO DIKABURKAN</span>
                  </div>
                </div>

                {/* info */}
                <div className="px-6 py-5">
                  <div className="flex items-baseline gap-3 mb-1">
                    <h2 className="font-serif text-3xl">{current.name}, {current.age}</h2>
                    <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" title="Dalam talian" />
                  </div>
                  <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {current.location} · {current.job}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">{current.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {current.tags.map(t => (
                      <span key={t} className="text-[10px] tracking-[0.1em] border border-gray-300 rounded-full px-3 py-1">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* action buttons */}
        {remaining.length > 0 && (
          <div className="flex items-center gap-6 mt-5">
            <button onClick={() => triggerAction("left")} className="w-14 h-14 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-500 hover:scale-105 transition-all">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <button onClick={() => triggerAction("right")} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:scale-105 transition-all" title="Suka">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </button>
            <button onClick={() => triggerAction("right")} className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-white hover:scale-105 transition-all">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
        )}
      </div>

      {/* match overlay */}
      {newMatch && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center px-8 text-center">
          <p className="text-white/60 text-xs tracking-[0.3em] uppercase mb-4">It's a Match!</p>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-gray-700 border-2 border-white flex items-center justify-center overflow-hidden">
              <svg width="40" height="48" viewBox="0 0 40 48" fill="none"><circle cx="20" cy="15" r="10" fill="#e5e7eb"/><ellipse cx="20" cy="38" rx="16" ry="10" fill="#e5e7eb"/></svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/30 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
            <div className="w-20 h-20 rounded-full border-2 border-white overflow-hidden" style={{ background: newMatch.color, filter: "blur(3px)" }}>
              <div className="w-full h-full flex items-center justify-center">
                <svg width="40" height="48" viewBox="0 0 40 48" fill="none"><circle cx="20" cy="15" r="10" fill="#9ca3af"/><ellipse cx="20" cy="38" rx="16" ry="10" fill="#9ca3af"/></svg>
              </div>
            </div>
          </div>
          <h2 className="font-serif text-4xl text-white font-normal mb-2">{newMatch.name} suka anda!</h2>
          <p className="text-white/60 text-sm mb-10">Teruskan dengan chat, atau tutup dan explore lagi.</p>
          <button onClick={() => { const id = newMatch.id; setNewMatch(null); onOpenChat(id); }} className="w-full bg-white text-black rounded-full py-4 font-medium mb-3 hover:bg-gray-100 transition-colors">
            Teruskan dengan chat
          </button>
          <button onClick={() => setNewMatch(null)} className="text-white/60 text-sm underline underline-offset-2">Teruskan explore</button>
        </div>
      )}

      <BottomNav active="explore" onGo={onNavGo} />
    </div>
  );
}

// ─── Feed Screen ─────────────────────────────────────────────────────────────

function FeedScreen({ me, onNavGo }: { me: UserProfile; onNavGo: (t: NavTab) => void }) {
  const [posts, setPosts] = useState(() => db.listPosts(me.id));
  const [composer, setComposer] = useState(false);
  const [text, setText] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const mediaRef = useRef<HTMLInputElement>(null);
  const matches = db.listMatches(me.id);

  const refresh = () => setPosts(db.listPosts(me.id));

  const publish = () => {
    if (!text.trim() && !mediaUrl) return;
    db.createPost(me, { text, mediaUrl, mediaType });
    setText("");
    setMediaUrl(null);
    setMediaType(null);
    setComposer(false);
    refresh();
  };

  const pickMedia = async (file: File) => {
    const isVideo = file.type.startsWith("video/");
    if (isVideo && file.size > 20 * 1024 * 1024) return;
    if (!isVideo && file.size > 5 * 1024 * 1024) return;
    setMediaUrl(await db.fileToDataUrl(file));
    setMediaType(isVideo ? "video" : "image");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 pt-8 pb-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <h1 className="font-serif text-2xl">Feed</h1>
        <button onClick={() => setComposer(true)} className="bg-black text-white rounded-full px-4 py-2 text-xs tracking-[0.15em] uppercase">
          Pos baharu
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-5 px-8 text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            </div>
            <p className="font-serif text-2xl">Tiada post lagi.</p>
            <p className="text-sm text-gray-500 leading-relaxed">Tulis pos pertama anda, atau match di Explore untuk melihat pos ahli lain. {matches.length} padanan.</p>
            <div className="flex gap-3">
              <button onClick={() => setComposer(true)} className="bg-black text-white rounded-full px-6 py-3 text-sm font-medium">Tulis pos</button>
              <button onClick={() => onNavGo("explore")} className="border border-gray-300 rounded-full px-6 py-3 text-sm font-medium">Explore</button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {posts.map(post => {
              const liked = post.likedBy.includes(me.id);
              return (
                <div key={post.id} className="px-6 py-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-200">
                      {post.authorPhoto
                        ? <img src={post.authorPhoto} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-gradient-to-b from-gray-300 to-gray-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{post.authorName}</p>
                      <p className="text-xs text-gray-400">{db.timeAgo(post.createdAt)}</p>
                    </div>
                  </div>
                  {post.text && <p className="text-sm text-gray-800 leading-relaxed mb-4">{post.text}</p>}
                  {post.mediaUrl && post.mediaType === "image" && (
                    <img src={post.mediaUrl} alt="" className="w-full rounded-2xl mb-4 max-h-80 object-cover" />
                  )}
                  {post.mediaUrl && post.mediaType === "video" && (
                    <video src={post.mediaUrl} controls className="w-full rounded-2xl mb-4 max-h-80" />
                  )}
                  <div className="flex items-center gap-5">
                    <button onClick={() => { db.togglePostLike(post.id, me.id); refresh(); }} className={`flex items-center gap-1.5 text-xs transition-colors ${liked ? "text-black" : "text-gray-400 hover:text-gray-600"}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      {post.likes}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {composer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="w-full max-w-sm bg-white rounded-t-3xl px-6 pt-5 pb-8">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h2 className="font-serif text-2xl mb-4">Pos baharu</h2>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Tulis sesuatu..."
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm min-h-[110px] outline-none focus:border-black resize-none mb-3"
            />
            {mediaUrl && mediaType === "image" && <img src={mediaUrl} alt="" className="w-full rounded-xl mb-3 max-h-40 object-cover" />}
            {mediaUrl && mediaType === "video" && <video src={mediaUrl} className="w-full rounded-xl mb-3 max-h-40" />}
            <input ref={mediaRef} type="file" accept="image/*,video/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) pickMedia(f); }} />
            <div className="flex gap-2 mb-4">
              <button onClick={() => mediaRef.current?.click()} className="flex-1 border border-gray-200 rounded-full py-3 text-xs tracking-[0.15em] uppercase">Gambar / Video</button>
              {mediaUrl && <button onClick={() => { setMediaUrl(null); setMediaType(null); }} className="px-4 border border-gray-200 rounded-full text-xs">Buang</button>}
            </div>
            <button onClick={publish} disabled={!text.trim() && !mediaUrl} className="w-full bg-black text-white rounded-full py-4 text-sm font-medium disabled:opacity-40 mb-2">Siarkan</button>
            <button onClick={() => setComposer(false)} className="w-full text-sm text-gray-500 py-2">Tutup</button>
          </div>
        </div>
      )}

      <BottomNav active="feed" onGo={onNavGo} />
    </div>
  );
}

function ChatInboxScreen({ me, onNavGo, onOpenChat }: { me: UserProfile; onNavGo: (t: NavTab) => void; onOpenChat: (id: string) => void }) {
  const matches = db.listMatches(me.id);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 pt-8 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <h1 className="font-serif text-2xl mb-0.5">Chat</h1>
        <p className="text-xs text-gray-400">{matches.length} padanan</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-5 px-8 text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <p className="font-serif text-2xl">Tiada chat lagi.</p>
            <p className="text-sm text-gray-500 leading-relaxed">Chat hanya terbuka apabila kedua-dua pihak match. Pergi ke Explore untuk mula.</p>
            <button onClick={() => onNavGo("explore")} className="bg-black text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-gray-900 transition-colors">Explore sekarang</button>
          </div>
        ) : (
          <div>
            <div className="mx-6 mt-4 mb-2 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" className="shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              <p className="text-xs text-gray-500">Ketik cadangan di dalam chat untuk mula berbual.</p>
            </div>
            <div className="divide-y divide-gray-100">
              {matches.map(m => {
                const last = db.lastMessage(me.id, m.id);
                return (
                  <button key={m.id} onClick={() => onOpenChat(m.id)} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                        {m.photoUrl
                          ? <img src={m.photoUrl} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-gradient-to-b from-gray-300 to-gray-500" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-medium">{m.displayName}{m.age ? `, ${m.age}` : ""}</p>
                        <span className="text-[10px] text-gray-400 shrink-0">{last ? db.timeAgo(last.createdAt) : ""}</span>
                      </div>
                      <p className="text-xs text-gray-400 truncate">{last?.text ?? "Mulakan perbualan..."}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <BottomNav active="chat" onGo={onNavGo} unreadChat={matches.length} />
    </div>
  );
}

function SetupCompleteScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="flex flex-col h-full px-6 py-10 bg-white items-center justify-center text-center">
      <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mb-8">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-3">Akaun siap</p>
      <h1 className="font-serif text-4xl leading-tight mb-4">Pendaftaran selesai.</h1>
      <p className="text-sm text-gray-500 leading-relaxed mb-10">Akaun anda telah dicipta. Log masuk untuk mula menggunakan poligami.my.</p>
      <button onClick={onLogin} className="w-full bg-black text-white rounded-full py-4 text-base font-medium hover:bg-gray-900 transition-colors">
        Pergi ke log masuk
      </button>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [selectedState, setSelectedState] = useState("Selangor");
  const [activeChecklistItem, setActiveChecklistItem] = useState(0);
  // per-item, per-section done flags — 4 items, up to 4 sections each
  const [sectionsDone, setSectionsDone] = useState<boolean[][]>([
    [false, false, false],
    [false, false, false, false],
    [false, false, false],
    [false, false, false],
  ]);
  const [regEmail, setRegEmail] = useState("");
  const [devToken, setDevToken] = useState<string | undefined>();
  const [showSplash, setShowSplash] = useState(true);
  const [me, setMe] = useState<UserProfile | null>(null);
  const [chatPeerId, setChatPeerId] = useState<string | null>(null);
  const [bootDone, setBootDone] = useState(false);
  const stackRef = useRef<Screen[]>(["login"]);

  const persistMe = (user: UserProfile) => {
    setMe(user);
    setSelectedState(user.state);
    setSectionsDone(user.checklistDone?.length ? user.checklistDone : [
      [false, false, false],
      [false, false, false, false],
      [false, false, false],
      [false, false, false],
    ]);
  };

  const go = (s: Screen) => {
    const stack = stackRef.current;
    if (stack[stack.length - 1] === s) {
      setScreen(s);
      return;
    }
    if (stack.length > 1 && stack[stack.length - 2] === s) {
      window.history.back();
      return;
    }
    setScreen(s);
    stackRef.current = [...stack, s];
    window.history.pushState({ screen: s }, "");
  };

  useEffect(() => {
    window.history.replaceState({ screen: "login" }, "");
    const onPop = () => {
      if (stackRef.current.length <= 1) return;
      stackRef.current = stackRef.current.slice(0, -1);
      setScreen(stackRef.current[stackRef.current.length - 1]);
    };
    window.addEventListener("popstate", onPop);

    const params = new URLSearchParams(window.location.search);
    const token = params.get("verify");
    if (token) {
      try {
        const pending = db.verifyToken(token);
        fetch(db.apiUrl(`/api/verify?token=${encodeURIComponent(token)}`)).catch(() => {});
        setRegEmail(pending.email);
        setShowSplash(false);
        go("create-profile");
        window.history.replaceState({}, "", window.location.pathname);
      } catch {
        /* invalid token */
      }
    }

    const session = db.getSession();
    if (session) {
      const user = db.getUser(session.userId);
      if (user) {
        persistMe(user);
        setShowSplash(false);
        if (user.onboardingComplete) setScreen("feed");
        else if (user.onboardingStep === "complete") setScreen("setup-complete");
        else setScreen(user.onboardingStep as Screen);
      }
    }
    setBootDone(true);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navGo = (t: NavTab) => {
    if (t === "ruang") go("trust-gate-dashboard");
    else if (t === "explore") go("explore");
    else if (t === "feed") go("feed");
    else if (t === "chat") go("chat-inbox");
    else if (t === "profil") go("account-settings");
  };

  const tickSection = (itemIdx: number, sectionIdx: number) => {
    setSectionsDone((prev) => {
      const next = prev.map((row) => [...row]);
      next[itemIdx][sectionIdx] = true;
      if (me) persistMe(db.updateUser(me.id, { checklistDone: next }));
      return next;
    });
  };

  const enterApp = (user: UserProfile) => {
    persistMe(user);
    if (user.onboardingComplete) go("feed");
    else if (user.onboardingStep === "complete") go("setup-complete");
    else go(user.onboardingStep as Screen);
  };

  if (!bootDone) return null;

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      <div className="relative w-full h-full bg-white flex flex-col overflow-hidden">
        {screen === "welcome" && (
          <WelcomeScreen onStart={() => go("pre-registration")} onLogin={() => go("login")} />
        )}
        {screen === "login" && (
          <LoginScreen
            onSuccess={enterApp}
            onBack={() => go("welcome")}
            onRegister={() => go("pre-registration")}
          />
        )}
        {screen === "pre-registration" && (
          <PreRegistrationScreen onNext={async ({ name, email, phone }) => {
            const result = await db.startRegistration({ fullName: name, email, phone });
            setRegEmail(result.email);
            setDevToken(result.devToken);
            go("email-verification");
          }} onBack={() => go("login")} />
        )}
        {screen === "email-verification" && (
          <EmailVerificationScreen onNext={() => go("create-profile")} onBack={() => go("pre-registration")} email={regEmail} devToken={devToken} />
        )}
        {screen === "create-profile" && (
          <CreateProfileScreen
            initialName={db.getPending(regEmail)?.fullName || me?.displayName || ""}
            onBack={() => go("email-verification")}
            onNext={async (data) => {
              const user = me
                ? db.updateUser(me.id, { displayName: data.displayName, age: data.age, occupation: data.occupation, photoUrl: data.photoUrl, onboardingStep: "role-status" })
                : await db.createAccountFromPending({ email: regEmail, ...data });
              persistMe(user);
              go("role-status");
            }}
          />
        )}
        {screen === "role-status" && (
          <RoleStatusScreen onNext={(role) => {
            if (me) persistMe(db.updateUser(me.id, { role, onboardingStep: "current-marriage" }));
            go("current-marriage");
          }} onBack={() => go("create-profile")} />
        )}
        {screen === "current-marriage" && (
          <CurrentMarriageScreen
            initialState={selectedState}
            onNext={(data) => {
              setSelectedState(data.state);
              if (me) persistMe(db.updateUser(me.id, {
                marriageDuration: data.duration,
                childrenCount: data.children,
                state: data.state,
                partnerInformed: data.informed,
                consulted: data.consulted,
                onboardingStep: "select-state",
              }));
              go("select-state");
            }}
            onBack={() => go("role-status")}
          />
        )}
        {screen === "select-state" && (
          <SelectStateScreen
            onNext={() => {
              if (me) persistMe(db.updateUser(me.id, { state: selectedState, onboardingStep: "legal-checklist" }));
              go("legal-checklist");
            }}
            onBack={() => go("current-marriage")}
            selected={selectedState}
            onSelect={(s) => {
              setSelectedState(s);
              if (me) persistMe(db.updateUser(me.id, { state: s }));
            }}
          />
        )}
        {screen === "legal-checklist" && (
          <LegalChecklistScreen
            onNext={() => {
              if (me) persistMe(db.updateUser(me.id, { onboardingStep: "identity-verification" }));
              go("identity-verification");
            }}
            onBack={() => go("select-state")}
            state={selectedState}
            sectionsDone={sectionsDone}
            onSectionsDone={(updated) => {
              setSectionsDone(updated);
              if (me) persistMe(db.updateUser(me.id, { checklistDone: updated }));
            }}
            onOpenItem={(idx) => { setActiveChecklistItem(idx); go("checklist-detail"); }}
          />
        )}
        {screen === "checklist-detail" && (
          <ChecklistDetailScreen
            itemIndex={activeChecklistItem}
            state={selectedState}
            sectionsDone={sectionsDone[activeChecklistItem] || []}
            onSectionTick={(si) => tickSection(activeChecklistItem, si)}
            onBack={() => go("legal-checklist")}
          />
        )}
        {screen === "identity-verification" && (
          <IdentityVerificationScreen onNext={() => go("upload-documents")} onBack={() => go("legal-checklist")} />
        )}
        {screen === "upload-documents" && (
          <UploadDocumentsScreen onBack={() => go("identity-verification")} onDone={(docs) => {
            if (me) {
              persistMe(db.updateUser(me.id, {
                mykadFront: docs.front,
                mykadBack: docs.back,
                onboardingComplete: true,
                onboardingStep: "complete",
              }));
              db.signOut();
              setMe(null);
            }
            go("setup-complete");
          }} />
        )}
        {screen === "setup-complete" && (
          <SetupCompleteScreen onLogin={() => go("login")} />
        )}
        {screen === "photo-privacy" && (
          <PhotoPrivacyScreen onNext={() => go("feed")} onBack={() => go("upload-documents")} />
        )}
        {screen === "trust-gate-dashboard" && (
          <TrustGateDashboard
            onProfile={() => go("candidate-profile")}
            onNavGo={navGo}
            onStatusSemakan={() => go("verification-status")}
          />
        )}
        {screen === "verification-status" && (
          <VerificationStatusScreen onBack={() => go("trust-gate-dashboard")} />
        )}
        {screen === "candidate-profile" && (
          <CandidateProfileScreen
            onBack={() => go("trust-gate-dashboard")}
            onConsentRequest={() => go("photo-consent-request")}
            onIntroduction={() => go("structured-introduction")}
          />
        )}
        {screen === "photo-consent-request" && (
          <PhotoConsentRequestScreen onSend={() => go("candidate-profile")} onBack={() => go("candidate-profile")} />
        )}
        {screen === "structured-introduction" && (
          <StructuredIntroductionScreen onNext={() => go("safe-chat")} onBack={() => go("candidate-profile")} />
        )}
        {screen === "safe-chat" && me && chatPeerId && (
          <SafeChatScreen me={me} peerId={chatPeerId} onBack={() => go("chat-inbox")} onReport={() => go("report-safety")} />
        )}
        {screen === "report-safety" && (
          <ReportSafetyScreen onBack={() => go("safe-chat")} />
        )}
        {screen === "account-settings" && me && (
          <AccountSettingsScreen
            me={me}
            onBack={() => go("feed")}
            onNavGo={navGo}
            onGoTo={go}
            onLogout={() => { db.signOut(); setMe(null); go("login"); }}
            onUpdate={(patch) => persistMe(db.updateUser(me.id, patch))}
          />
        )}
        {screen === "panduan" && (
          <PanduanScreen onNavGo={navGo} />
        )}
        {screen === "explore" && me && (
          <ExploreScreen
            me={me}
            onNavGo={navGo}
            onOpenChat={(id) => { setChatPeerId(id); go("safe-chat"); }}
          />
        )}
        {screen === "feed" && me && (
          <FeedScreen me={me} onNavGo={navGo} />
        )}
        {screen === "chat-inbox" && me && (
          <ChatInboxScreen
            me={me}
            onNavGo={navGo}
            onOpenChat={(id) => { setChatPeerId(id); go("safe-chat"); }}
          />
        )}
        {screen === "settings-profil" && me && (
          <SettingsProfilScreen
            me={me}
            onBack={() => go("account-settings")}
            onSave={(patch) => persistMe(db.updateUser(me.id, patch))}
          />
        )}
        {screen === "settings-privasi" && <SettingsPrivasiScreen onBack={() => go("account-settings")} />}
        {screen === "settings-dokumen" && <SettingsDokumenScreen onBack={() => go("account-settings")} />}
        {screen === "settings-notifikasi" && <SettingsNotifikasiScreen onBack={() => go("account-settings")} />}
        {screen === "settings-keselamatan" && <SettingsKeselamatanScreen onBack={() => go("account-settings")} />}
        {screen === "bantuan" && <BantuanScreen onBack={() => go("account-settings")} />}
        {screen === "polisi-privasi" && <PolisiPrivasiScreen onBack={() => go("account-settings")} />}
        {screen === "terma-penggunaan" && <TermaPenggunaanScreen onBack={() => go("account-settings")} />}
        {screen === "padam-akaun" && <PadamAkaunScreen onBack={() => go("account-settings")} onConfirmDelete={() => { db.signOut(); setMe(null); go("welcome"); }} />}
      </div>
    </div>
  );
}

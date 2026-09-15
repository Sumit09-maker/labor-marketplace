"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Bell,
  Briefcase,
  Calendar,
  Clock,
  Handshake,
  Hourglass,
  IdCard,
  KeyRound,
  Languages,
  Loader2,
  LogOut,
  MapPin,
  Navigation,
  Phone,
  ShieldAlert,
  Star,
  XCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkillIcon from "@/components/SkillIcon";
import { StarDisplay } from "@/components/StarRating";
import { avatarGradient, initials } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

type DashboardData = {
  worker: {
    id: number;
    registrationId: string;
    name: string;
    phone: string;
    aadhaar: string;
    skill: string;
    skillLabel: string;
    experience: string;
    dailyRate: number;
    city: string;
    area: string;
    landmark: string | null;
    languages: string | null;
    username: string;
    available: boolean;
    status: string;
    jobsCompleted: number;
    ratingAvg: number;
    ratingCount: number;
    createdAt: string;
  };
  hireRequests: {
    id: number;
    employerName: string;
    employerPhone: string;
    message: string | null;
    createdAt: string;
  }[];
  ratings: {
    id: number;
    employerName: string;
    rating: number;
    comment: string | null;
    createdAt: string;
  }[];
};

export default function DashboardPage() {
  const router = useRouter();
  const { dict, skillName, expLabel, timeAgo, translateServer } = useLanguage();
  const t = dict.dash;

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [toast, setToast] = useState("");

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState({ text: "", ok: false });
  const [pwLoading, setPwLoading] = useState(false);

  const inputCls =
    "w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100";

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/worker/availability");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const d = await res.json();
      setData(d);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleAvailability() {
    if (!data) return;
    setToggling(true);
    try {
      const res = await fetch("/api/worker/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !data.worker.available }),
      });
      const d = await res.json();
      if (d.ok) {
        setData((prev) => (prev ? { ...prev, worker: { ...prev.worker, available: d.available } } : prev));
        showToast(translateServer("Availability updated"));
      }
    } finally {
      setToggling(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwLoading(true);
    setPwMsg({ text: "", ok: false });
    try {
      const res = await fetch("/api/worker/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw, confirmPassword: confirmPw }),
      });
      const d = await res.json();
      setPwMsg({ text: translateServer(d.message ?? ""), ok: !!d.ok });
      if (d.ok) {
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
      }
    } catch {
      setPwMsg({ text: translateServer("Network error. Please try again."), ok: false });
    } finally {
      setPwLoading(false);
    }
  }

  if (loading || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-brand-50/40">
        <Loader2 className="h-10 w-10 animate-spin text-brand-500" />
        <p className="mt-4 text-sm font-semibold text-slate-400">{t.loading}</p>
      </div>
    );
  }

  const w = data.worker;

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/60 to-white">
      <Navbar />

      {toast && (
        <div className="animate-fade-in fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full bg-brand-950 px-5 py-2.5 text-sm font-bold text-white shadow-2xl">
          {toast}
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        {/* status banners */}
        {w.status === "pending" && (
          <div className="animate-fade-in mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <Hourglass className="mt-0.5 h-5 w-5 shrink-0 animate-bounce-slow text-amber-600" />
            <div>
              <p className="font-extrabold text-amber-800">{t.pendingT}</p>
              <p className="text-sm text-amber-700">{t.pendingD}</p>
            </div>
          </div>
        )}
        {w.status === "rejected" && (
          <div className="animate-fade-in mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div>
              <p className="font-extrabold text-red-700">{t.rejectedT}</p>
              <p className="text-sm text-red-600">{t.rejectedD}</p>
            </div>
          </div>
        )}
        {w.status === "approved" && (
          <div className="animate-fade-in mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <p className="font-extrabold text-emerald-800">{t.liveT}</p>
              <p className="text-sm text-emerald-700">{t.liveD}</p>
            </div>
          </div>
        )}

        {/* header card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <div className="relative bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 p-6 sm:p-7">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarGradient(
                    w.name,
                  )} text-xl font-extrabold text-white shadow-lg ring-4 ring-white/20`}
                >
                  {initials(w.name)}
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-200">{t.loggedAs}</p>
                  <h1 className="text-2xl font-extrabold text-white">{w.name}</h1>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-amber-300">
                    <SkillIcon skill={w.skill} className="h-4 w-4" />
                    {skillName(w.skill, w.skillLabel)} · {w.registrationId}
                  </p>
                </div>
              </div>

              {/* availability toggle */}
              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                <button
                  onClick={toggleAvailability}
                  disabled={toggling}
                  className={`relative flex h-11 w-24 items-center rounded-full p-1.5 transition-colors duration-300 ${
                    w.available ? "bg-emerald-500/30" : "bg-black/30"
                  }`}
                  aria-label="Toggle availability"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${
                      w.available ? "translate-x-[52px]" : "translate-x-0"
                    }`}
                  >
                    {toggling ? (
                      <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                    ) : (
                      <span className={`h-3 w-3 rounded-full ${w.available ? "bg-emerald-500" : "bg-slate-300"}`} />
                    )}
                  </span>
                </button>
                <p className="text-xs font-bold text-white">{w.available ? t.availOn : t.availOff}</p>
              </div>
            </div>
          </div>

          {/* stats strip */}
          <div className="grid grid-cols-2 divide-x divide-slate-100 sm:grid-cols-4">
            <div className="p-5 text-center">
              <p className="text-2xl font-extrabold text-brand-950">{formatINR(w.dailyRate)}</p>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">{t.rate}</p>
            </div>
            <div className="p-5 text-center">
              <p className="text-2xl font-extrabold text-brand-950">{w.jobsCompleted}</p>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">{t.jobs}</p>
            </div>
            <div className="p-5 text-center">
              <p className="flex items-center justify-center gap-1 text-2xl font-extrabold text-brand-950">
                {w.ratingCount > 0 ? w.ratingAvg.toFixed(1) : "—"}
                {w.ratingCount > 0 && <Star className="h-5 w-5 fill-amber-400 text-amber-400" />}
              </p>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t.avgRating} ({w.ratingCount})
              </p>
            </div>
            <div className="p-5 text-center">
              <p className="text-2xl font-extrabold text-brand-950">{data.hireRequests.length}</p>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">{t.requests}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          {/* left column */}
          <div className="space-y-8 lg:col-span-3">
            {/* hire requests */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-7">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-brand-950">
                <Bell className="h-5 w-5 text-amber-500" />
                {t.requests}
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-extrabold text-amber-700">
                  {data.hireRequests.length}
                </span>
              </h2>
              {data.hireRequests.length === 0 ? (
                <p className="mt-5 rounded-xl bg-slate-50 p-5 text-center text-sm font-medium text-slate-400">
                  {t.noRequests}
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {data.hireRequests.map((r) => (
                    <div key={r.id} className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient(
                              r.employerName,
                            )} text-sm font-extrabold text-white`}
                          >
                            {initials(r.employerName)}
                          </span>
                          <div>
                            <p className="text-sm font-extrabold text-brand-950">{r.employerName}</p>
                            <p className="text-[11px] text-slate-400">{timeAgo(r.createdAt)}</p>
                          </div>
                        </div>
                        <a
                          href={`tel:+91${r.employerPhone}`}
                          className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-emerald-200 transition-transform hover:-translate-y-0.5"
                        >
                          <Phone className="h-3.5 w-3.5" /> {t.callBack}
                        </a>
                      </div>
                      <p className="mt-3 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
                        +91 {r.employerPhone.replace(/(\d{5})(\d{5})/, "$1 $2")}
                      </p>
                      {r.message && <p className="mt-2 text-sm leading-relaxed text-slate-600">&ldquo;{r.message}&rdquo;</p>}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* my ratings */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-7">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-brand-950">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                {t.myRatings}
              </h2>
              {data.ratings.length === 0 ? (
                <p className="mt-5 rounded-xl bg-slate-50 p-5 text-center text-sm font-medium text-slate-400">
                  {t.noRatings}
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {data.ratings.map((r) => (
                    <div key={r.id} className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-extrabold text-brand-950">{r.employerName}</p>
                        <StarDisplay value={r.rating} size="h-3.5 w-3.5" />
                      </div>
                      {r.comment && <p className="mt-2 text-sm leading-relaxed text-slate-600">&ldquo;{r.comment}&rdquo;</p>}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* right column */}
          <div className="space-y-8 lg:col-span-2">
            {/* profile details */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-7">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-brand-950">
                <IdCard className="h-5 w-5 text-brand-500" /> {t.details}
              </h2>
              <dl className="mt-5 space-y-3.5 text-sm">
                {[
                  { icon: Phone, label: t.labels.phone, value: `+91 ${w.phone}` },
                  { icon: IdCard, label: t.labels.aadhaar, value: w.aadhaar },
                  { icon: MapPin, label: t.labels.location, value: `${w.area}, ${w.city}` },
                  { icon: Navigation, label: t.labels.landmark, value: w.landmark ?? t.notProvided },
                  { icon: Clock, label: t.labels.experience, value: expLabel(w.experience) },
                  { icon: Languages, label: t.labels.languages, value: w.languages ?? t.notProvided },
                  {
                    icon: Calendar,
                    label: t.labels.registeredOn,
                    value: new Date(w.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                    <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div className="flex flex-1 items-center justify-between gap-3">
                      <dt className="font-semibold text-slate-400">{row.label}</dt>
                      <dd className="text-right font-bold text-brand-950">{row.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>

            {/* change password */}
            <form
              onSubmit={changePassword}
              className="rounded-3xl border border-brand-100 bg-white p-6 shadow-lg shadow-brand-100/40 sm:p-7"
            >
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-brand-950">
                <KeyRound className="h-5 w-5 text-brand-500" /> {t.changePw}
              </h2>
              <div className="mt-5 space-y-4">
                <input type="password" className={inputCls} placeholder={t.current} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
                <input type="password" className={inputCls} placeholder={t.newPw} value={newPw} onChange={(e) => setNewPw(e.target.value)} />
                <input type="password" className={inputCls} placeholder={t.confirm} value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
              </div>
              {pwMsg.text && (
                <p
                  className={`animate-fade-in mt-3 rounded-xl px-4 py-2.5 text-xs font-bold ${
                    pwMsg.ok ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                  }`}
                >
                  {pwMsg.text}
                </p>
              )}
              <button
                type="submit"
                disabled={pwLoading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-800 to-brand-950 py-3 text-sm font-extrabold text-white shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-60"
              >
                {pwLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                {t.update}
              </button>
            </form>

            <button
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-red-100 bg-red-50 py-3.5 text-sm font-extrabold text-red-500 transition-all hover:border-red-200 hover:bg-red-100"
            >
              <LogOut className="h-4 w-4" /> {t.logout}
            </button>

            {w.status === "pending" && (
              <p className="flex items-start gap-2 rounded-xl border border-brand-100 bg-brand-50 p-4 text-xs leading-relaxed text-brand-700">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                {t.approvalNote} <span className="font-extrabold">{w.registrationId}</span>
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

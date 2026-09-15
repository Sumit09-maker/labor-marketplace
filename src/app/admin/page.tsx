"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  Clock,
  Hourglass,
  Loader2,
  Lock,
  LogOut,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react";
import { StarDisplay } from "@/components/StarRating";
import { avatarGradient, initials } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import { LanguageToggle, useLanguage } from "@/lib/i18n";

type Registration = {
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
  languages: string | null;
  username: string;
  status: string;
  available: boolean;
  ratingAvg: number;
  ratingCount: number;
  jobsCompleted: number;
  createdAt: string;
};

type Counts = { pending: number; approved: number; rejected: number; total: number };

export default function AdminPage() {
  const router = useRouter();
  const { dict, skillName, translateServer } = useLanguage();
  const t = dict.admin;

  const [auth, setAuth] = useState<"unknown" | "guest" | "admin">("unknown");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
  const [loginLoading, setLoginLoading] = useState(false);

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [counts, setCounts] = useState<Counts>({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [listLoading, setListLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  const inputCls =
    "w-full rounded-xl border-2 border-white/15 bg-white/5 px-4 py-3.5 pl-11 text-sm font-medium text-white outline-none transition-all placeholder:text-slate-400 focus:border-amber-400/70 focus:bg-white/10 focus:ring-4 focus:ring-amber-400/10";

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const loadRegistrations = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await fetch("/api/admin/registrations");
      if (res.status === 401) {
        setAuth("guest");
        return;
      }
      const data = await res.json();
      setRegistrations(data.registrations ?? []);
      setCounts(data.counts ?? { pending: 0, approved: 0, rejected: 0, total: 0 });
    } catch {
      setRegistrations([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d?.role === "admin") {
          setAuth("admin");
          loadRegistrations();
        } else setAuth("guest");
      })
      .catch(() => setAuth("guest"));
  }, [loadRegistrations]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError(t.bothRequired);
      setShake((s) => s + 1);
      return;
    }
    setLoginLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(translateServer(data.message ?? t.generic));
        setShake((s) => s + 1);
        setLoginLoading(false);
        return;
      }
      setAuth("admin");
      loadRegistrations();
    } catch {
      setError(t.network);
      setShake((s) => s + 1);
    } finally {
      setLoginLoading(false);
    }
  }

  async function setStatus(id: number, status: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.ok) {
        showToast(status === "approved" ? t.toastApproved : t.toastRejected);
        loadRegistrations();
      }
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: number) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        showToast(t.toastDeleted);
        loadRegistrations();
      }
    } finally {
      setBusyId(null);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return registrations.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      return [r.name, r.phone, r.registrationId, r.city, r.area, r.skillLabel, r.username]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q));
    });
  }, [registrations, search, filter]);

  /* ---------- loading ---------- */
  if (auth === "unknown") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-50">
        <Loader2 className="h-10 w-10 animate-spin text-brand-500" />
      </div>
    );
  }

  /* ---------- login ---------- */
  if (auth === "guest") {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 px-4 py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          <div className="absolute right-[12%] top-24 animate-float opacity-10">
            <ShieldCheck className="h-20 w-20 text-white" />
          </div>
        </div>
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
          <LanguageToggle />
        </div>
        <div className="relative w-full max-w-md">
          <div key={shake} className={shake > 0 ? "animate-shake" : ""}>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 text-brand-950 shadow-xl">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h1 className="mt-5 text-2xl font-extrabold text-white sm:text-3xl">{t.loginTitle}</h1>
                <p className="mt-2 text-sm font-medium text-slate-300">{t.loginSubtitle}</p>
              </div>
              {error && (
                <div className="animate-fade-in mt-5 rounded-xl border border-red-400/30 bg-red-500/15 p-3.5 text-center text-sm font-semibold text-red-100">
                  {error}
                </div>
              )}
              <form onSubmit={login} className="mt-7 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-200">{t.username}</label>
                  <div className="relative">
                    <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input className={inputCls} placeholder={t.usernamePh} value={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-200">{t.password}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input type="password" className={inputCls} placeholder={t.passwordPh} value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-4 text-sm font-extrabold text-brand-950 shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> {t.verifying}
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" /> {t.loginBtn}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          <Link href="/" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-300 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" /> {t.back}
          </Link>
        </div>
      </div>
    );
  }

  /* ---------- admin dashboard ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/70 to-white">
      {toast && (
        <div className="animate-fade-in fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-full bg-brand-950 px-5 py-2.5 text-sm font-bold text-white shadow-2xl">
          {toast}
        </div>
      )}

      {/* header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 pb-8 pt-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3.5">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400 text-brand-950 shadow-lg">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-white sm:text-2xl">{t.title}</h1>
              <p className="text-xs font-semibold text-slate-300">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-white/10"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> {t.homeBtn}
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-extrabold text-brand-950 shadow-md transition-transform hover:-translate-y-0.5"
            >
              <LogOut className="h-3.5 w-3.5" /> {t.logout}
            </button>
          </div>
        </div>

        {/* counts */}
        <div className="relative mx-auto mt-6 grid max-w-7xl grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            { label: t.total, value: counts.total, icon: UsersRound, key: "all" as const },
            { label: t.pending, value: counts.pending, icon: Hourglass, key: "pending" as const },
            { label: t.approved, value: counts.approved, icon: CheckCircle2, key: "approved" as const },
            { label: t.rejected, value: counts.rejected, icon: XCircle, key: "rejected" as const },
          ].map((c) => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={`rounded-2xl border p-4 text-left backdrop-blur-sm transition-all hover:-translate-y-0.5 ${
                filter === c.key
                  ? "border-amber-400/50 bg-white/15"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <c.icon className={`h-5 w-5 ${filter === c.key ? "text-amber-300" : "text-white"}`} />
              <p className="mt-2 text-2xl font-extrabold text-white">{c.value}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300">{c.label}</p>
            </button>
          ))}
        </div>
      </section>

      {/* search */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPh}
              className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm font-medium outline-none transition-all focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
          </div>
          {filter !== "all" && (
            <button
              onClick={() => setFilter("all")}
              className="shrink-0 rounded-full bg-brand-100 px-4 py-2 text-xs font-extrabold text-brand-700"
            >
              {filter} ✕
            </button>
          )}
        </div>
      </div>

      {/* list */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {listLoading ? (
          <div className="flex flex-col items-center py-24">
            <Loader2 className="h-9 w-9 animate-spin text-brand-400" />
            <p className="mt-4 text-sm font-semibold text-slate-400">{t.loading}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg">
            <UsersRound className="mx-auto h-12 w-12 text-brand-300" />
            <h3 className="mt-4 text-xl font-extrabold text-brand-950">{t.noneT}</h3>
            <p className="mt-2 text-sm text-slate-500">{t.noneD}</p>
            <Link
              href="/register"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-800 to-brand-950 px-5 py-2.5 text-sm font-extrabold text-white shadow-md"
            >
              {t.openRegister}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="animate-fade-in rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg sm:p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <span
                      className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br p-3.5 text-base font-extrabold text-white ${avatarGradient(
                        r.name,
                      )}`}
                    >
                      {initials(r.name)}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-extrabold text-brand-950">{r.name}</h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                            r.status === "approved"
                              ? "bg-emerald-100 text-emerald-700"
                              : r.status === "rejected"
                                ? "bg-red-100 text-red-600"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {r.status}
                        </span>
                        {r.status === "approved" && (
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                              r.available ? "bg-brand-100 text-brand-600" : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {r.available ? t.available : t.busy}
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1 text-amber-600">
                          <Briefcase className="h-3.5 w-3.5" /> {skillName(r.skill, r.skillLabel)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {r.area}, {r.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" /> {r.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <BadgeCheck className="h-3.5 w-3.5" /> {r.registrationId}
                        </span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {r.experience}
                        </span>
                        <span>{formatINR(r.dailyRate)}/day</span>
                        <span>@{r.username}</span>
                        <span>Aadhaar: {r.aadhaar}</span>
                        {r.ratingCount > 0 && (
                          <span className="flex items-center gap-1">
                            <StarDisplay value={r.ratingAvg} size="h-3 w-3" /> {r.ratingAvg.toFixed(1)}
                          </span>
                        )}
                        <span>
                          {t.registered}:{" "}
                          {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 lg:flex-col xl:flex-row">
                    {r.status !== "approved" && (
                      <button
                        onClick={() => setStatus(r.id, "approved")}
                        disabled={busyId === r.id}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-emerald-200 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        {busyId === r.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                        {t.approve}
                      </button>
                    )}
                    {r.status !== "rejected" && (
                      <button
                        onClick={() => setStatus(r.id, "rejected")}
                        disabled={busyId === r.id}
                        className="flex items-center gap-1.5 rounded-xl border-2 border-red-200 px-4 py-2.5 text-xs font-extrabold text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                      >
                        <XCircle className="h-3.5 w-3.5" /> {t.reject}
                      </button>
                    )}
                    <button
                      onClick={() => remove(r.id)}
                      disabled={busyId === r.id}
                      className="flex items-center justify-center rounded-xl border-2 border-slate-200 p-2.5 text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

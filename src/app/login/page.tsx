"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  HardHat,
  Loader2,
  Lock,
  LogIn,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";
import { LanguageToggle, useLanguage } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const { dict, translateServer } = useLanguage();
  const t = dict.login;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
  const [loading, setLoading] = useState(false);

  const inputCls =
    "w-full rounded-xl border-2 border-white/15 bg-white/5 px-4 py-3.5 pl-11 text-sm font-medium text-white outline-none transition-all placeholder:text-slate-400 focus:border-amber-400/70 focus:bg-white/10 focus:ring-4 focus:ring-amber-400/10";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError(t.bothRequired);
      setShake((s) => s + 1);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(translateServer(data.message ?? t.generic));
        setShake((s) => s + 1);
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    } catch {
      setError(t.network);
      setShake((s) => s + 1);
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 px-4 py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        <div className="absolute left-[10%] top-24 animate-float opacity-10">
          <HardHat className="h-20 w-20 text-white" />
        </div>
        <div className="absolute bottom-24 right-[12%] animate-float opacity-10 delay-300">
          <Wrench className="h-16 w-16 text-white" />
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
                <HardHat className="h-8 w-8" />
              </div>
              <h1 className="mt-5 text-2xl font-extrabold text-white sm:text-3xl">{t.title}</h1>
              <p className="mt-2 text-sm font-medium text-slate-300">{t.subtitle}</p>
            </div>

            {error && (
              <div className="animate-fade-in mt-5 rounded-xl border border-red-400/30 bg-red-500/15 p-3.5 text-center text-sm font-semibold text-red-100">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="mt-7 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-200">{t.username}</label>
                <div className="relative">
                  <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className={inputCls}
                    placeholder={t.usernamePh}
                    value={username}
                    autoComplete="username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-200">{t.password}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    className={inputCls}
                    placeholder={t.passwordPh}
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-4 text-sm font-extrabold text-brand-950 shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> {t.verifying}
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" /> {t.btn}
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-300">
              {t.newHere}{" "}
              <Link href="/register" className="font-extrabold text-amber-400 underline underline-offset-4 hover:text-amber-300">
                {t.registerFree}
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-sm font-semibold text-slate-300 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" /> {t.backHome}
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            <ShieldCheck className="h-3.5 w-3.5" /> {t.adminLogin}
          </Link>
        </div>

        <p className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-[11px] leading-relaxed text-slate-400">
          {t.demo}
        </p>
      </div>
    </div>
  );
}

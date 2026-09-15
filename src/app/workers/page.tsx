"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Loader2,
  MapPinned,
  Navigation,
  Search,
  SlidersHorizontal,
  ToggleLeft,
  UsersRound,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WorkerCard, { type WorkerListItem } from "@/components/WorkerCard";
import { SKILLS } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n";

const WorkersMap = dynamic(() => import("@/components/WorkersMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] w-full items-center justify-center rounded-3xl bg-brand-50">
      <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
    </div>
  ),
});

function WorkersContent() {
  const searchParams = useSearchParams();
  const { dict, skillName } = useLanguage();
  const t = dict.workers;

  const [workers, setWorkers] = useState<WorkerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState(searchParams.get("skill") ?? "");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [locMessage, setLocMessage] = useState("");
  const [locating, setLocating] = useState(false);

  const load = useCallback(
    async (opts?: { lat?: number; lng?: number }) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        if (skill) params.set("skill", skill);
        if (availableOnly) params.set("available", "1");
        if (opts?.lat && opts?.lng) {
          params.set("lat", String(opts.lat));
          params.set("lng", String(opts.lng));
        } else if (userPos) {
          params.set("lat", String(userPos.lat));
          params.set("lng", String(userPos.lng));
        }
        const res = await fetch(`/api/workers?${params.toString()}`);
        const data = await res.json();
        setWorkers(data.workers ?? []);
      } catch {
        setWorkers([]);
      } finally {
        setLoading(false);
      }
    },
    [query, skill, availableOnly, userPos],
  );

  useEffect(() => {
    const tm = setTimeout(() => load(), 300);
    return () => clearTimeout(tm);
  }, [load]);

  const findNearest = () => {
    if (!navigator.geolocation) {
      setLocMessage(t.geoUnsupported);
      return;
    }
    setLocating(true);
    setLocMessage("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(coords);
        setShowMap(true);
        setLocating(false);
        setLocMessage(t.within5);
        load({ lat: coords.lat, lng: coords.lng });
      },
      () => {
        setLocating(false);
        setLocMessage(t.geoDenied);
      },
      { timeout: 8000 },
    );
  };

  const nearby = useMemo(
    () => (userPos ? workers.filter((w) => typeof w.distanceKm === "number" && w.distanceKm <= 5) : []),
    [workers, userPos],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/60 to-white">
      <Navbar />

      {/* header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 pb-14 pt-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-300 backdrop-blur-sm">
            <UsersRound className="h-3.5 w-3.5" /> {t.badge}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
            {t.titleA} <span className="text-amber-400">{t.titleB}</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-slate-300">{t.subtitle}</p>

          {/* search bar */}
          <div className="mx-auto mt-7 max-w-2xl">
            <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl">
              <Search className="ml-3 h-5 w-5 shrink-0 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPh}
                className="w-full bg-transparent py-2.5 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                onClick={findNearest}
                disabled={locating}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-3 text-xs font-extrabold text-brand-950 shadow-lg shadow-amber-200 transition-all hover:-translate-y-0.5 disabled:opacity-60 sm:px-5 sm:text-sm"
              >
                {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                <span className="hidden sm:inline">{t.nearest}</span>
                <span className="sm:hidden">{t.nearMe}</span>
              </button>
            </div>
            {locMessage && (
              <p className="animate-fade-in mt-3 text-xs font-semibold text-amber-200">{locMessage}</p>
            )}
          </div>
        </div>
      </section>

      {/* filters */}
      <section className="sticky top-[68px] z-30 border-b border-slate-200 bg-white/90 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 no-scrollbar sm:px-6 lg:px-8">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-400" />
          <button
            onClick={() => setSkill("")}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
              skill === ""
                ? "bg-brand-900 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-700"
            }`}
          >
            {t.allSkills}
          </button>
          {SKILLS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSkill((prev) => (prev === s.value ? "" : s.value))}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
                skill === s.value
                  ? "bg-brand-900 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              {skillName(s.value, s.label)}
            </button>
          ))}
          <button
            onClick={() => setAvailableOnly((v) => !v)}
            className={`ml-auto flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
              availableOnly
                ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300"
                : "bg-slate-100 text-slate-600 hover:bg-emerald-50"
            }`}
          >
            <ToggleLeft className="h-4 w-4" />
            {t.availableNow}
          </button>
          <button
            onClick={() => setShowMap((v) => !v)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
              showMap
                ? "bg-brand-100 text-brand-700 ring-1 ring-brand-300"
                : "bg-slate-100 text-slate-600 hover:bg-brand-50"
            }`}
          >
            <MapPinned className="h-4 w-4" />
            {showMap ? t.hideMap : t.showMap}
          </button>
        </div>
      </section>

      {/* content */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {showMap && (
          <div className="animate-fade-in-up mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
            <div className="bg-gradient-to-r from-brand-800 to-brand-900 px-5 py-3.5 text-white">
              <p className="flex items-center gap-2 text-sm font-extrabold">
                <MapPinned className="h-4 w-4 text-amber-400" /> {t.mapTitle}
              </p>
              {userPos && nearby.length > 0 && (
                <p className="mt-0.5 text-xs text-brand-100">{t.nearbyCount(nearby.length)}</p>
              )}
            </div>
            <div className="h-[420px]">
              <WorkersMap workers={workers} userPosition={userPos} />
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-brand-400" />
            <p className="mt-4 text-sm font-semibold text-slate-400">{t.loading}</p>
          </div>
        ) : workers.length === 0 ? (
          <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg">
            <Search className="mx-auto h-12 w-12 text-brand-300" />
            <h3 className="mt-4 text-xl font-extrabold text-brand-950">{t.noneTitle}</h3>
            <p className="mt-2 text-sm text-slate-500">{t.noneDesc}</p>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm font-semibold text-slate-500">
              <span className="font-extrabold text-brand-700">{workers.length}</span>{" "}
              {t.found(workers.length).replace(String(workers.length), "").trim()}
              {userPos ? ` — ${t.sorted}` : ""}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {workers.map((w) => (
                <WorkerCard key={w.id} worker={w} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function WorkersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-400" />
        </div>
      }
    >
      <WorkersContent />
    </Suspense>
  );
}

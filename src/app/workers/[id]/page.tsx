"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Handshake,
  Languages,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  Send,
  UserRound,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkillIcon from "@/components/SkillIcon";
import { StarDisplay, StarInput } from "@/components/StarRating";
import { avatarGradient, initials } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

type RatingRow = {
  id: number;
  employerName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};

type WorkerDetail = {
  id: number;
  registrationId: string;
  name: string;
  phone: string;
  skill: string;
  skillLabel: string;
  experience: string;
  dailyRate: number;
  city: string;
  area: string;
  landmark: string | null;
  languages: string | null;
  available: boolean;
  ratingAvg: number;
  ratingCount: number;
  jobsCompleted: number;
  createdAt: string;
};

export default function WorkerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { dict, skillName, expLabel, timeAgo, translateServer } = useLanguage();
  const t = dict.profile;

  const [worker, setWorker] = useState<WorkerDetail | null>(null);
  const [ratings, setRatings] = useState<RatingRow[]>([]);
  const [connections, setConnections] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [rateName, setRateName] = useState("");
  const [rateValue, setRateValue] = useState(0);
  const [rateComment, setRateComment] = useState("");
  const [rateMsg, setRateMsg] = useState({ text: "", ok: false });
  const [rateLoading, setRateLoading] = useState(false);

  const [hireName, setHireName] = useState("");
  const [hirePhone, setHirePhone] = useState("");
  const [hireMessage, setHireMessage] = useState("");
  const [hireMsg, setHireMsg] = useState({ text: "", ok: false });
  const [hireLoading, setHireLoading] = useState(false);

  const inputCls =
    "w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100";

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/workers/${id}`);
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setNotFound(true);
        return;
      }
      setWorker(data.worker);
      setRatings(data.ratings ?? []);
      setConnections(data.connections ?? 0);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function submitRating(e: React.FormEvent) {
    e.preventDefault();
    if (!rateName.trim() || rateValue === 0) {
      setRateMsg({ text: t.ratingError, ok: false });
      return;
    }
    setRateLoading(true);
    try {
      const res = await fetch(`/api/workers/${id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employerName: rateName, rating: rateValue, comment: rateComment }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setRateMsg({ text: translateServer(data.message ?? "Action failed"), ok: false });
      } else {
        setRateMsg({ text: t.ratingThanks, ok: true });
        setRateName("");
        setRateValue(0);
        setRateComment("");
        load();
      }
    } catch {
      setRateMsg({ text: t.network, ok: false });
    } finally {
      setRateLoading(false);
    }
  }

  async function submitHire(e: React.FormEvent) {
    e.preventDefault();
    if (!hireName.trim() || !/^\d{10}$/.test(hirePhone)) {
      setHireMsg({ text: t.hireError, ok: false });
      return;
    }
    setHireLoading(true);
    try {
      const res = await fetch(`/api/workers/${id}/hire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employerName: hireName, employerPhone: hirePhone, message: hireMessage }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setHireMsg({ text: translateServer(data.message ?? "Action failed"), ok: false });
      } else {
        setHireMsg({ text: translateServer(data.message), ok: true });
        setHireName("");
        setHirePhone("");
        setHireMessage("");
        load();
      }
    } catch {
      setHireMsg({ text: t.network, ok: false });
    } finally {
      setHireLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-brand-50/40">
        <Loader2 className="h-10 w-10 animate-spin text-brand-500" />
        <p className="mt-4 text-sm font-semibold text-slate-400">{t.loading}</p>
      </div>
    );
  }

  if (notFound || !worker) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-brand-50/40 px-4">
        <UserRound className="h-14 w-14 text-brand-300" />
        <h1 className="mt-4 text-2xl font-extrabold text-brand-950">{t.notFound}</h1>
        <p className="mt-2 text-sm text-slate-500">{t.notFoundDesc}</p>
        <Link
          href="/workers"
          className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-800 to-brand-950 px-6 py-3 text-sm font-extrabold text-white shadow-lg"
        >
          <ArrowLeft className="h-4 w-4" /> {t.back}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/60 to-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <Link
          href="/workers"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" /> {t.back}
        </Link>

        {/* profile header */}
        <div className="animate-fade-in-up mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <div className="relative h-28 bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/20 blur-2xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            <div className="absolute right-6 top-6 animate-float opacity-15">
              <Briefcase className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="px-6 pb-6 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <div
                className={`relative -mt-12 flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-white bg-gradient-to-br ${avatarGradient(
                  worker.name,
                )} text-3xl font-extrabold text-white shadow-xl`}
              >
                {initials(worker.name)}
                <span
                  className={`absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full border-4 border-white ${
                    worker.available ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-extrabold text-brand-950 sm:text-3xl">{worker.name}</h1>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-700">
                    <BadgeCheck className="h-3.5 w-3.5" /> {t.verified}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                      worker.available ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {worker.available ? t.available : t.busy}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5 text-amber-600">
                    <SkillIcon skill={worker.skill} className="h-4 w-4" />
                    {skillName(worker.skill, worker.skillLabel)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {worker.area}, {worker.city}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-slate-400" />
                    {expLabel(worker.experience)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <p className="text-3xl font-extrabold text-brand-950">
                  {formatINR(worker.dailyRate)}
                  <span className="text-sm font-semibold text-slate-400"> {t.day}</span>
                </p>
                <a
                  href={`tel:+91${worker.phone}`}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5"
                >
                  <Phone className="h-4 w-4" /> {t.callNow}
                </a>
              </div>
            </div>

            {/* quick stats */}
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl bg-amber-50 p-4 text-center">
                <StarDisplay value={worker.ratingAvg} className="justify-center" />
                <p className="mt-1.5 text-lg font-extrabold text-brand-950">
                  {worker.ratingCount > 0 ? worker.ratingAvg.toFixed(1) : "—"}
                </p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {worker.ratingCount > 0 ? `${worker.ratingCount} ${t.ratings}` : t.noRatingsYet}
                </p>
              </div>
              <div className="rounded-2xl bg-brand-50 p-4 text-center">
                <Briefcase className="mx-auto h-5 w-5 text-brand-500" />
                <p className="mt-1.5 text-lg font-extrabold text-brand-950">{worker.jobsCompleted}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t.jobs}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                <Handshake className="mx-auto h-5 w-5 text-emerald-500" />
                <p className="mt-1.5 text-lg font-extrabold text-brand-950">{connections}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t.connections}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4 text-center">
                <Calendar className="mx-auto h-5 w-5 text-slate-500" />
                <p className="mt-1.5 text-lg font-extrabold text-brand-950">{worker.registrationId}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t.regId}</p>
              </div>
            </div>

            {/* extra info */}
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {worker.landmark && (
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
                  <Navigation className="h-4 w-4 shrink-0 text-amber-500" />
                  {worker.landmark}
                </div>
              )}
              {worker.languages && (
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
                  <Languages className="h-4 w-4 shrink-0 text-amber-500" />
                  {worker.languages}
                </div>
              )}
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
                <Phone className="h-4 w-4 shrink-0 text-amber-500" />
                +91 {worker.phone.replace(/(\d{5})(\d{5})/, "$1 $2")}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          {/* ratings column */}
          <div className="space-y-8 lg:col-span-3">
            <form
              onSubmit={submitRating}
              className="rounded-3xl border border-amber-200/60 bg-white p-6 shadow-lg shadow-amber-100/40 sm:p-7"
            >
              <h2 className="text-lg font-extrabold text-brand-950">
                {t.rateTitle(worker.name.split(" ")[0])}
              </h2>
              <p className="mt-1 text-xs text-slate-400">{t.rateDesc}</p>
              <div className="mt-4">
                <StarInput value={rateValue} onChange={setRateValue} />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input className={inputCls} placeholder={t.yourName} value={rateName} onChange={(e) => setRateName(e.target.value)} />
                <input className={inputCls} placeholder={t.commentOpt} value={rateComment} onChange={(e) => setRateComment(e.target.value)} />
              </div>
              {rateMsg.text && (
                <p
                  className={`animate-fade-in mt-3 rounded-xl px-4 py-2.5 text-xs font-bold ${
                    rateMsg.ok ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                  }`}
                >
                  {rateMsg.text}
                </p>
              )}
              <button
                type="submit"
                disabled={rateLoading}
                className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-sm font-extrabold text-brand-950 shadow-md shadow-amber-200 transition-all hover:-translate-y-0.5 disabled:opacity-60"
              >
                {rateLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {t.submitRating}
              </button>
            </form>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-7">
              <h2 className="text-lg font-extrabold text-brand-950">
                {t.reviews}{" "}
                <span className="ml-1 rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-extrabold text-brand-600">
                  {ratings.length}
                </span>
              </h2>
              {ratings.length === 0 ? (
                <p className="mt-5 rounded-xl bg-slate-50 p-5 text-center text-sm font-medium text-slate-400">
                  {t.firstRating}
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {ratings.map((r) => (
                    <div key={r.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
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
                        <StarDisplay value={r.rating} size="h-3.5 w-3.5" />
                      </div>
                      {r.comment && (
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">&ldquo;{r.comment}&rdquo;</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* hire form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={submitHire}
              className="sticky top-24 rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-100/40 sm:p-7"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-200">
                  <Handshake className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-extrabold text-brand-950">{t.hireTitle}</h2>
                  <p className="text-xs text-slate-400">{t.hireDesc}</p>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                <input className={inputCls} placeholder={t.hireNamePh} value={hireName} onChange={(e) => setHireName(e.target.value)} />
                <input
                  className={inputCls}
                  placeholder={t.hirePhonePh}
                  inputMode="numeric"
                  maxLength={10}
                  value={hirePhone}
                  onChange={(e) => setHirePhone(e.target.value.replace(/\D/g, ""))}
                />
                <textarea
                  className={`${inputCls} min-h-24 resize-none`}
                  placeholder={t.hireMsgPh}
                  value={hireMessage}
                  onChange={(e) => setHireMessage(e.target.value)}
                />
              </div>
              {hireMsg.text && (
                <p
                  className={`animate-fade-in mt-3 rounded-xl px-4 py-2.5 text-xs font-bold ${
                    hireMsg.ok ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                  }`}
                >
                  {hireMsg.ok && <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />}
                  {hireMsg.text}
                </p>
              )}
              <button
                type="submit"
                disabled={hireLoading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 disabled:opacity-60"
              >
                {hireLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {t.sendHire}
              </button>
              <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-400">{t.noMiddle}</p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import Link from "next/link";
import { Briefcase, MapPin, Navigation, Phone } from "lucide-react";
import { StarDisplay } from "@/components/StarRating";
import SkillIcon from "@/components/SkillIcon";
import { avatarGradient, initials } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

export type WorkerListItem = {
  id: number;
  registrationId: string;
  name: string;
  skill: string;
  skillLabel: string;
  experience: string;
  dailyRate: number;
  city: string;
  area: string;
  available: boolean;
  ratingAvg: number;
  ratingCount: number;
  jobsCompleted: number;
  phone: string;
  lat: number;
  lng: number;
  distanceKm?: number | null;
};

export default function WorkerCard({ worker }: { worker: WorkerListItem }) {
  const { dict, skillName, expLabel } = useLanguage();
  const t = dict.card;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-100/60">
      <div className="flex items-start gap-4">
        <div
          className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarGradient(
            worker.name,
          )} text-lg font-extrabold text-white shadow-md`}
        >
          {initials(worker.name)}
          <span
            className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
              worker.available ? "bg-emerald-500" : "bg-slate-300"
            }`}
            title={worker.available ? "Available" : "Busy"}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-base font-bold text-brand-950">{worker.name}</h3>
            {typeof worker.distanceKm === "number" && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-600">
                <Navigation className="h-3 w-3" />
                {worker.distanceKm} km
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-amber-600">
            <SkillIcon skill={worker.skill} className="h-4 w-4" />
            {skillName(worker.skill, worker.skillLabel)}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {worker.area}, {worker.city}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-2.5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.dailyRate}</p>
          <p className="text-base font-extrabold text-brand-950">
            {formatINR(worker.dailyRate)}
            <span className="text-xs font-medium text-slate-400"> {t.day}</span>
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.exp}</p>
          <p className="text-xs font-bold text-slate-700">{expLabel(worker.experience)}</p>
        </div>
        <div className="text-right">
          {worker.ratingCount > 0 ? (
            <>
              <StarDisplay value={worker.ratingAvg} size="h-3.5 w-3.5" />
              <p className="text-[11px] font-semibold text-slate-500">
                {worker.ratingAvg.toFixed(1)} ({worker.ratingCount})
              </p>
            </>
          ) : (
            <p className="text-[11px] font-semibold text-slate-400">{t.noRatings}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Link
          href={`/workers/${worker.id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-800 to-brand-950 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg"
        >
          <Briefcase className="h-4 w-4" /> {t.viewHire}
        </Link>
        <a
          href={`tel:+91${worker.phone}`}
          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-emerald-200 text-emerald-600 transition-colors hover:border-emerald-400 hover:bg-emerald-50"
          title={t.call}
        >
          <Phone className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

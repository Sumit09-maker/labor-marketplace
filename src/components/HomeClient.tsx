"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Briefcase,
  CircleDollarSign,
  ClipboardCheck,
  Hammer,
  Handshake,
  MapPin,
  PhoneCall,
  Search,
  ShieldCheck,
  Star,
  UserRound,
  UsersRound,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import SkillIcon from "@/components/SkillIcon";
import { SKILLS } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n";

export type HomeStats = {
  members: number;
  jobs: number;
  cities: number;
  avgRating: number;
  connections: number;
};

const TESTIMONIAL_ACCENTS = [
  { border: "border-slate-200 hover:border-amber-400 hover:shadow-amber-100", badge: "bg-amber-100 text-amber-700" },
  { border: "border-slate-200 hover:border-brand-400 hover:shadow-brand-100", badge: "bg-brand-100 text-brand-700" },
  { border: "border-slate-200 hover:border-emerald-400 hover:shadow-emerald-100", badge: "bg-emerald-100 text-emerald-700" },
  { border: "border-slate-200 hover:border-slate-400 hover:shadow-slate-200", badge: "bg-slate-200 text-slate-700" },
];

const WHY_ICONS = [UserRound, MapPin, Banknote, Star, UsersRound, ShieldCheck];

export default function HomeClient({ stats }: { stats: HomeStats }) {
  const { dict, skillName } = useLanguage();

  const workerSteps = [
    { icon: ClipboardCheck, t: dict.steps.w1t, d: dict.steps.w1d, bg: "bg-amber-50", color: "from-amber-400 to-amber-500 text-brand-950" },
    { icon: MapPin, t: dict.steps.w2t, d: dict.steps.w2d, bg: "bg-brand-50", color: "from-brand-600 to-brand-800 text-white" },
    { icon: CircleDollarSign, t: dict.steps.w3t, d: dict.steps.w3d, bg: "bg-emerald-50", color: "from-emerald-500 to-emerald-600 text-white" },
  ];
  const employerSteps = [
    { icon: Search, t: dict.steps.e1t, d: dict.steps.e1d, bg: "bg-brand-50", color: "from-brand-600 to-brand-800 text-white" },
    { icon: PhoneCall, t: dict.steps.e2t, d: dict.steps.e2d, bg: "bg-amber-50", color: "from-amber-400 to-amber-500 text-brand-950" },
    { icon: Handshake, t: dict.steps.e3t, d: dict.steps.e3d, bg: "bg-emerald-50", color: "from-emerald-500 to-emerald-600 text-white" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 pb-20 pt-28 sm:pb-28 sm:pt-36">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          <div className="absolute left-[8%] top-24 animate-float opacity-10">
            <Hammer className="h-24 w-24 text-white" />
          </div>
          <div className="absolute bottom-16 right-[10%] animate-float opacity-10 delay-300">
            <Briefcase className="h-20 w-20 text-white" />
          </div>
          <div className="absolute right-[35%] top-1/2 hidden animate-bounce-slow opacity-10 lg:block">
            <UsersRound className="h-16 w-16 text-white" />
          </div>
          <div className="absolute bottom-24 left-[20%] hidden animate-float opacity-10 delay-500 lg:block">
            <BadgeCheck className="h-14 w-14 text-white" />
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-300 backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
              {dict.hero.badge}
            </div>

            <h1 className="animate-fade-in-up mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white delay-100 sm:text-6xl">
              {dict.hero.titleA}{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-amber-400">{dict.hero.titleB}</span>
                <span className="absolute -bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-amber-400/20" />
              </span>
            </h1>

            <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-slate-300 delay-200 sm:text-lg">
              {dict.hero.subtitle}
            </p>

            <div className="animate-fade-in-up mt-9 flex flex-col items-center justify-center gap-3 delay-300 sm:flex-row">
              <Link
                href="/register"
                className="animate-pulse-glow group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-4 text-base font-extrabold text-brand-950 shadow-2xl transition-all hover:-translate-y-1 sm:w-auto"
              >
                <UserRound className="h-5 w-5" />
                {dict.hero.ctaWorker}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/workers"
                className="group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-white/20 bg-white/5 px-8 py-4 text-base font-extrabold text-white backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/10 sm:w-auto"
              >
                <Search className="h-5 w-5" />
                {dict.hero.ctaEmployer}
              </Link>
            </div>

            {/* live stats */}
            <div className="animate-fade-in-up mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-3 delay-400 sm:grid-cols-4">
              {[
                { value: `${stats.members}+`, label: dict.hero.stats.members },
                { value: `${stats.jobs}+`, label: dict.hero.stats.jobs },
                { value: `${stats.cities}+`, label: dict.hero.stats.cities },
                {
                  value: stats.avgRating > 0 ? `${stats.avgRating}★` : "—",
                  label: dict.hero.stats.rating,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  <p className="text-2xl font-extrabold text-white sm:text-3xl">{s.value}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <svg
          className="absolute bottom-0 left-0 right-0"
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 108C120 96 240 72 360 66C480 60 600 72 720 78C840 84 960 84 1080 78C1200 72 1320 60 1380 54L1440 48V120H0Z"
            fill="#f8fafc"
          />
        </svg>
      </section>

      {/* ================= WHAT ARE YOU LOOKING FOR ================= */}
      <section className="py-16 sm:py-24" id="paths">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <span className="inline-block rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-700">
              {dict.paths.kicker}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">
              {dict.paths.title}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Reveal delay={100}>
              <Link
                href="/register"
                className="group block overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-100/60 sm:p-10"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-brand-950 shadow-lg shadow-amber-200 transition-transform group-hover:scale-110 group-hover:rotate-6">
                  <UserRound className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-2xl font-extrabold text-brand-950">
                  {dict.paths.workerTitle}
                </h3>
                <p className="mt-3 leading-relaxed text-slate-600">{dict.paths.workerDesc}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-bold text-amber-600">
                  {dict.paths.workerCta}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </span>
              </Link>
            </Reveal>

            <Reveal delay={200}>
              <Link
                href="/workers"
                className="group block overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-brand-500 hover:shadow-2xl hover:shadow-brand-100 sm:p-10"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 text-white shadow-lg shadow-brand-200 transition-transform group-hover:scale-110 group-hover:rotate-6">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-2xl font-extrabold text-brand-950">
                  {dict.paths.employerTitle}
                </h3>
                <p className="mt-3 leading-relaxed text-slate-600">{dict.paths.employerDesc}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-bold text-brand-600">
                  {dict.paths.employerCta}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-white py-16 sm:py-24" id="how">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <span className="inline-block rounded-full bg-brand-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-700">
              {dict.steps.kicker}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">
              {dict.steps.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-500">{dict.steps.subtitle}</p>
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            <Reveal delay={100}>
              <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8">
                <span className="rounded-lg bg-amber-400 px-4 py-1.5 text-sm font-extrabold text-brand-950">
                  {dict.steps.forWorkers}
                </span>
                <div className="mt-6 space-y-4">
                  {workerSteps.map((step) => (
                    <div
                      key={step.t}
                      className={`flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5`}
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} shadow-md`}
                      >
                        <step.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-brand-950">{step.t}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={250}>
              <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8">
                <span className="rounded-lg bg-brand-800 px-4 py-1.5 text-sm font-extrabold text-white">
                  {dict.steps.forEmployers}
                </span>
                <div className="mt-6 space-y-4">
                  {employerSteps.map((step) => (
                    <div
                      key={step.t}
                      className={`flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5`}
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} shadow-md`}
                      >
                        <step.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-brand-950">{step.t}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= WHO CAN YOU FIND ================= */}
      <section className="py-16 sm:py-24" id="skills">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <span className="inline-block rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-700">
              {dict.skillsSec.kicker}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">
              {dict.skillsSec.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-500">{dict.skillsSec.subtitle}</p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {SKILLS.map((skill, i) => (
              <Reveal key={skill.value} delay={(i % 5) * 80}>
                <Link
                  href={`/workers?skill=${skill.value}`}
                  className="group flex h-full flex-col items-center rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-brand-400 hover:shadow-xl hover:shadow-brand-100"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-all group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-brand-700 group-hover:to-brand-900 group-hover:text-white">
                    <SkillIcon skill={skill.value} className="h-7 w-7" />
                  </span>
                  <span className="mt-4 text-sm font-bold text-brand-950 group-hover:text-brand-600">
                    {skillName(skill.value, skill.label)}
                  </span>
                  <span className="mt-1 text-[11px] font-medium text-slate-400">
                    {dict.skillsSec.verified}
                  </span>
                </Link>
              </Reveal>
            ))}
            <Reveal delay={450}>
              <Link
                href="/workers"
                className="group flex h-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-brand-300 bg-brand-50/50 p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:border-brand-500 hover:bg-brand-50"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm transition-transform group-hover:scale-110">
                  <ArrowRight className="h-7 w-7" />
                </span>
                <span className="mt-4 text-sm font-bold text-brand-700">{dict.skillsSec.viewAll}</span>
                <span className="mt-1 text-[11px] font-medium text-slate-400">
                  {dict.skillsSec.allWorkers}
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= WHY JOIN ================= */}
      <section className="bg-white py-16 sm:py-24" id="why">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700">
              {dict.why.kicker}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">
              {dict.why.title}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dict.why.items.map((benefit, i) => {
              const Icon = WHY_ICONS[i];
              return (
                <Reveal key={benefit.t} delay={(i % 3) * 100}>
                  <div className="group h-full rounded-3xl border border-slate-200 bg-slate-50/50 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:bg-white hover:shadow-xl hover:shadow-brand-100/60">
                    <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-3 text-white shadow-md shadow-brand-200 transition-transform group-hover:scale-110 group-hover:-rotate-6">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 text-lg font-extrabold text-brand-950">{benefit.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{benefit.d}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-16 sm:py-24" id="stories">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <span className="inline-block rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-700">
              {dict.stories.kicker}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">
              {dict.stories.title}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dict.testimonials.map((t, i) => {
              const accent = TESTIMONIAL_ACCENTS[i % TESTIMONIAL_ACCENTS.length];
              return (
                <Reveal key={t.name} delay={i * 100}>
                  <figure
                    className={`flex h-full flex-col rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${accent.border}`}
                  >
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold ${accent.badge}`}
                      >
                        {t.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                      <div>
                        <p className="text-sm font-extrabold text-brand-950">{t.name}</p>
                        <p className="text-xs text-slate-500">{t.role}</p>
                      </div>
                    </figcaption>
                  </figure>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative overflow-hidden bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        </div>
        <Reveal className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {dict.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-medium leading-relaxed text-slate-300">
            {dict.cta.desc}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-4 font-extrabold text-brand-950 shadow-2xl transition-all hover:-translate-y-1"
            >
              <UserRound className="h-5 w-5" />
              {dict.cta.worker}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/workers"
              className="flex items-center gap-2 rounded-xl border-2 border-white/20 px-8 py-4 font-extrabold text-white transition-all hover:-translate-y-1 hover:bg-white/10"
            >
              <Search className="h-5 w-5" />
              {dict.cta.employer}
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}

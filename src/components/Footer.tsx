"use client";

import Link from "next/link";
import { Hammer, HeartHandshake, MapPin, Phone } from "lucide-react";
import { SKILLS } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n";

export default function Footer() {
  const { dict } = useLanguage();
  const t = dict.footer;

  const quickLinks = [
    { href: "/", label: t.links.home },
    { href: "/register", label: t.links.register },
    { href: "/workers", label: t.links.findWorkers },
    { href: "/community", label: t.links.community },
    { href: "/login", label: t.links.workerLogin },
    { href: "/admin", label: t.links.adminLogin },
  ];

  return (
    <footer className="bg-brand-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-brand-950">
              <Hammer className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold text-white">
              Labour <span className="text-amber-400">Chowk</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">{t.about}</p>
          <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
            <HeartHandshake className="h-4 w-4 shrink-0 text-amber-400" />
            {t.promise}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">{t.quickLinks}</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href + l.label}>
                <Link href={l.href} className="transition-colors hover:text-amber-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            {t.popularSkills}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {SKILLS.slice(0, 6).map((s) => (
              <li key={s.value}>
                <Link
                  href={`/workers?skill=${s.value}`}
                  className="transition-colors hover:text-amber-400"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">{t.contact}</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              {t.address}
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-amber-400" />
              {t.helpline}
            </li>
          </ul>
          <p className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-relaxed text-slate-400">
            {t.helplineNote}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {t.rights}</p>
          <p>{t.words}</p>
        </div>
      </div>
    </footer>
  );
}

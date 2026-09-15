"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Hammer,
  LayoutDashboard,
  LogIn,
  Menu,
  Search,
  ShieldCheck,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { LanguageToggle, useLanguage } from "@/lib/i18n";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState<"worker" | "admin" | null>(null);
  const pathname = usePathname();
  const { dict } = useLanguage();
  const t = dict.nav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setLoggedIn(d?.role ?? null))
      .catch(() => setLoggedIn(null));
  }, [pathname]);

  const links = [
    { href: "/", label: t.home },
    { href: "/workers", label: t.findWorkers },
    { href: "/register", label: t.findWork },
    { href: "/community", label: t.community },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 shadow-lg shadow-slate-200/70 backdrop-blur-xl"
          : "bg-white/70 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-800 to-brand-950 text-amber-400 shadow-lg shadow-slate-300 transition-transform group-hover:scale-105">
            <Hammer className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold tracking-tight text-brand-950">
              Labour <span className="text-amber-500">Chowk</span>
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {t.tagline}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                pathname === link.href
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-brand-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageToggle />
          {loggedIn === "worker" ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-800 to-brand-950 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-300 transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <LayoutDashboard className="h-4 w-4" /> {t.dashboard}
            </Link>
          ) : loggedIn === "admin" ? (
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-800 to-brand-950 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-300 transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <ShieldCheck className="h-4 w-4" /> {t.adminPanel}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-full border-2 border-brand-200 px-4 py-2 text-sm font-bold text-brand-700 transition-colors hover:border-brand-400 hover:bg-brand-50"
              >
                <LogIn className="h-4 w-4" /> {t.login}
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2.5 text-sm font-extrabold text-brand-950 shadow-lg shadow-amber-200 transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                <UserRound className="h-4 w-4" /> {t.register}
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-800"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="animate-fade-in border-t border-slate-100 bg-white/95 px-4 pb-5 pt-3 backdrop-blur-xl md:hidden">
          <div className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-brand-50"
              >
                {link.href === "/workers" ? (
                  <Search className="h-4 w-4 text-brand-500" />
                ) : link.href === "/community" ? (
                  <UsersRound className="h-4 w-4 text-brand-500" />
                ) : (
                  <UserRound className="h-4 w-4 text-brand-500" />
                )}
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            {loggedIn === "worker" ? (
              <Link
                href="/dashboard"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-900 py-3 text-sm font-bold text-white"
              >
                <LayoutDashboard className="h-4 w-4" /> {t.dashboard}
              </Link>
            ) : loggedIn === "admin" ? (
              <Link
                href="/admin"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-900 py-3 text-sm font-bold text-white"
              >
                <ShieldCheck className="h-4 w-4" /> {t.adminPanel}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-brand-200 py-3 text-sm font-bold text-brand-700"
                >
                  <LogIn className="h-4 w-4" /> {t.login}
                </Link>
                <Link
                  href="/register"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-400 py-3 text-sm font-extrabold text-brand-950"
                >
                  <UserRound className="h-4 w-4" /> {t.register}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

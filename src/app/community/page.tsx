"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, MapPin, MessageCircle, Send, UsersRound } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { avatarGradient, initials } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n";

type Post = {
  id: number;
  name: string;
  skill: string | null;
  city: string | null;
  content: string;
  createdAt: string;
};

export default function CommunityPage() {
  const { dict, timeAgo, translateServer } = useLanguage();
  const t = dict.comm;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<{ name: string; skillLabel: string; city: string } | null>(null);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [skill, setSkill] = useState("");
  const [content, setContent] = useState("");
  const [postMsg, setPostMsg] = useState({ text: "", ok: false });
  const [posting, setPosting] = useState(false);

  const inputCls =
    "w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100";

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/community");
      const data = await res.json();
      setPosts(data.posts ?? []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d?.role === "worker" && d.worker) {
          setMe({ name: d.worker.name, skillLabel: d.worker.skillLabel, city: d.worker.city });
        }
      })
      .catch(() => {});
  }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPosting(true);
    setPostMsg({ text: "", ok: false });
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, city, skill, content }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setPostMsg({ text: translateServer(data.message ?? "Action failed"), ok: false });
      } else {
        setContent("");
        setPostMsg({ text: t.posted, ok: true });
        load();
      }
    } catch {
      setPostMsg({ text: t.network, ok: false });
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/60 to-white">
      <Navbar />

      {/* header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 pb-14 pt-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          <div className="absolute right-[15%] top-20 animate-float opacity-10">
            <UsersRound className="h-20 w-20 text-white" />
          </div>
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-300 backdrop-blur-sm">
            <UsersRound className="h-3.5 w-3.5" /> {t.badge}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">{t.title}</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-relaxed text-slate-300">
            {t.subtitle}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* post form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={submit}
              className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-7"
            >
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-brand-950">
                <MessageCircle className="h-5 w-5 text-amber-500" />
                {t.postTitle}
              </h2>
              {me ? (
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-brand-50 p-3.5">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient(
                      me.name,
                    )} text-sm font-extrabold text-white`}
                  >
                    {initials(me.name)}
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-brand-950">{me.name}</p>
                    <p className="text-[11px] font-semibold text-amber-600">
                      {t.postingAs} {me.skillLabel} · {me.city}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-3.5">
                  <input className={inputCls} placeholder={t.namePh} value={name} onChange={(e) => setName(e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <input className={inputCls} placeholder={t.cityPh} value={city} onChange={(e) => setCity(e.target.value)} />
                    <input className={inputCls} placeholder={t.skillPh} value={skill} onChange={(e) => setSkill(e.target.value)} />
                  </div>
                </div>
              )}
              <textarea
                className={`${inputCls} mt-4 min-h-28 resize-none`}
                placeholder={t.contentPh}
                maxLength={500}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <div className="mt-1.5 text-right text-[11px] font-semibold text-slate-400">
                {content.length}/500
              </div>
              {postMsg.text && (
                <p
                  className={`animate-fade-in mt-2 rounded-xl px-4 py-2.5 text-xs font-bold ${
                    postMsg.ok ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                  }`}
                >
                  {postMsg.text}
                </p>
              )}
              <button
                type="submit"
                disabled={posting}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3.5 text-sm font-extrabold text-brand-950 shadow-lg shadow-amber-200 transition-all hover:-translate-y-0.5 disabled:opacity-60"
              >
                {posting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> {t.sending}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> {t.btn}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* feed */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center py-20">
                <Loader2 className="h-9 w-9 animate-spin text-brand-400" />
                <p className="mt-4 text-sm font-semibold text-slate-400">{t.loading}</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg">
                <MessageCircle className="mx-auto h-12 w-12 text-brand-300" />
                <h3 className="mt-4 text-xl font-extrabold text-brand-950">{t.noneT}</h3>
                <p className="mt-2 text-sm text-slate-500">{t.noneD}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((p, i) => (
                  <article
                    key={p.id}
                    className="animate-fade-in-up rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ animationDelay: `${Math.min(i, 6) * 70}ms` }}
                  >
                    <div className="flex items-start gap-3.5">
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarGradient(
                          p.name,
                        )} text-sm font-extrabold text-white shadow-md`}
                      >
                        {initials(p.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-brand-950">{p.name}</h3>
                          {p.skill && (
                            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-brand-600">
                              {p.skill}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 flex items-center gap-2 text-[11px] font-medium text-slate-400">
                          {p.city && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {p.city}
                            </span>
                          )}
                          <span>{timeAgo(p.createdAt)}</span>
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.content}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

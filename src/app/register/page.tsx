"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  ClipboardCopy,
  IdCard,
  KeyRound,
  Loader2,
  Lock,
  MapPin,
  Phone,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import SkillIcon from "@/components/SkillIcon";
import { AREA_COORDS, EXPERIENCE_OPTIONS, SKILLS, avatarGradient, initials } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n";

type Errors = Record<string, string>;

export default function RegisterPage() {
  const router = useRouter();
  const { dict, skillName, translateServer } = useLanguage();
  const t = dict.reg;

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ registrationId: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    name: "", phone: "", aadhaar: "", skill: "", experience: "",
    dailyRate: "", city: "", area: "", landmark: "", languages: "",
    username: "", password: "", confirmPassword: "", agree: false,
  });

  const inputCls =
    "w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 pl-11 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100";

  const set = (key: string, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
    setServerError("");
  };

  function validateStep(current: number): boolean {
    const e: Errors = {};
    if (current === 1) {
      if (!form.name.trim()) e.name = t.err.nameReq;
      else if (form.name.trim().length < 2) e.name = t.err.nameMin;
      if (!form.phone.trim()) e.phone = t.err.phoneReq;
      else if (!/^\d{10}$/.test(form.phone.trim())) e.phone = t.err.phoneValid;
      if (!form.aadhaar.trim()) e.aadhaar = t.err.aadhaarReq;
      else if (!/^\d{12}$/.test(form.aadhaar.trim())) e.aadhaar = t.err.aadhaarValid;
    }
    if (current === 2) {
      if (!form.skill) e.skill = t.err.skillReq;
      if (!form.experience) e.experience = t.err.expReq;
      const rate = Number(form.dailyRate);
      if (!form.dailyRate) e.dailyRate = t.err.rateReq;
      else if (!Number.isFinite(rate) || rate < 100 || rate > 10000) e.dailyRate = t.err.rateValid;
      if (!form.city.trim()) e.city = t.err.cityReq;
      else if (form.city.trim().length < 2) e.city = t.err.cityMin;
      if (!form.area.trim()) e.area = t.err.areaReq;
    }
    if (current === 3) {
      if (!form.username.trim()) e.username = t.err.userReq;
      else if (form.username.trim().length < 4) e.username = t.err.userMin;
      else if (!/^[a-zA-Z0-9_]+$/.test(form.username.trim())) e.username = t.err.userPattern;
      if (!form.password) e.password = t.err.passReq;
      else if (form.password.length < 6) e.password = t.err.passMin;
      if (form.confirmPassword !== form.password) e.confirmPassword = t.err.passMatch;
      if (!form.agree) e.agree = t.err.termsReq;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validateStep(step)) setStep((s) => Math.min(3, s + 1));
  }

  async function submit() {
    if (!validateStep(3)) return;
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, dailyRate: Number(form.dailyRate) }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (data.errors) {
          const mapped: Errors = {};
          if (data.errors.username) mapped.username = translateServer(data.message) || t.err.userPattern;
          if (data.errors.phone) mapped.phone = translateServer(data.message) || t.err.phoneValid;
          setErrors((prev) => ({ ...prev, ...mapped }));
        }
        setServerError(translateServer(data.message ?? t.err.generic));
        setLoading(false);
        return;
      }
      setResult({ registrationId: data.registrationId });
    } catch {
      setServerError(t.err.network);
      setLoading(false);
    }
  }

  /* ---------- Success screen ---------- */
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800">
        <Navbar />
        <div className="mx-auto flex max-w-lg flex-col items-center px-4 pb-20 pt-32 sm:px-6">
          <div className="animate-fade-in-up w-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto flex h-20 w-20 animate-bounce-slow items-center justify-center rounded-full bg-amber-400 text-brand-950 shadow-xl">
              <CheckCircle2 className="h-11 w-11" />
            </div>
            <h1 className="mt-6 text-3xl font-extrabold text-white">{t.successTitle}</h1>
            <p className="mt-2 text-sm font-medium text-slate-300">
              {t.successMsg(form.name.split(" ")[0])}
            </p>

            <div className="mt-7 rounded-2xl bg-white p-6 text-left shadow-lg">
              <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {t.regIdLabel}
              </p>
              <div className="mt-2 flex items-center justify-center gap-3">
                <p className="text-3xl font-extrabold tracking-widest text-brand-700">
                  {result.registrationId}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.registrationId);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors hover:bg-brand-100"
                  title="Copy ID"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-2 text-center text-xs text-slate-400">{t.saveNote}</p>

              <div className="mt-5 flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${avatarGradient(form.name)} font-extrabold text-white`}
                >
                  {initials(form.name)}
                </span>
                <div>
                  <p className="font-extrabold text-brand-950">{form.name}</p>
                  <p className="text-xs font-semibold text-amber-600">
                    {skillName(form.skill)} · ₹{Number(form.dailyRate).toLocaleString("en-IN")}/day
                  </p>
                  <p className="text-xs text-slate-500">{form.area}, {form.city}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-300/30 bg-amber-400/10 p-4 text-left">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
              <p className="text-xs leading-relaxed text-amber-100">{t.reviewNote}</p>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <Link
                href="/"
                className="rounded-xl border-2 border-white/20 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                {t.backHome}
              </Link>
              <button
                onClick={() => router.push("/dashboard")}
                className="rounded-xl bg-amber-400 py-3 text-sm font-extrabold text-brand-950 shadow-lg transition-transform hover:-translate-y-0.5"
              >
                {t.goDashboard}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Form ---------- */
  const stepIcons = [UserRound, Briefcase, KeyRound];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50/70 via-white to-slate-50">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 pb-20 pt-28 sm:px-6">
        <div className="text-center">
          <span className="inline-block rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-700">
            {t.kicker}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">
            {t.title}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">{t.subtitle}</p>
        </div>

        {/* stepper */}
        <div className="mx-auto mt-8 flex max-w-md items-center">
          {t.steps.map((label, i) => {
            const n = i + 1;
            const StepIcon = stepIcons[i];
            return (
              <div key={label} className={`flex items-center ${i < 2 ? "flex-1" : ""}`}>
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-extrabold transition-all ${
                      step > n
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : step === n
                          ? "border-brand-700 bg-gradient-to-br from-brand-700 to-brand-900 text-white shadow-lg shadow-brand-200"
                          : "border-slate-200 bg-white text-slate-400"
                    }`}
                  >
                    {step > n ? <BadgeCheck className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                  </span>
                  <span className={`mt-1.5 text-[11px] font-bold ${step >= n ? "text-brand-700" : "text-slate-400"}`}>
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <div className={`mx-2 mb-5 h-1 flex-1 rounded-full transition-colors ${step > n ? "bg-emerald-400" : "bg-slate-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        {serverError && (
          <div className="animate-shake mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-semibold text-red-600">
            {serverError}
          </div>
        )}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          {step === 1 && (
            <div className="animate-fade-in space-y-5">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-brand-950">
                <UserRound className="h-5 w-5 text-brand-600" /> {t.s1title}
              </h2>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">{t.name}</label>
                <div className="relative">
                  <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input className={inputCls} placeholder={t.namePh} value={form.name} onChange={(e) => set("name", e.target.value)} />
                </div>
                {errors.name && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">{t.phone}</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input className={inputCls} placeholder={t.phonePh} inputMode="numeric" maxLength={10} value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} />
                </div>
                {errors.phone && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.phone}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">{t.aadhaar}</label>
                <div className="relative">
                  <IdCard className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input className={inputCls} placeholder={t.aadhaarPh} inputMode="numeric" maxLength={12} value={form.aadhaar} onChange={(e) => set("aadhaar", e.target.value.replace(/\D/g, ""))} />
                </div>
                <p className="mt-1.5 text-xs text-slate-400">{t.aadhaarNote}</p>
                {errors.aadhaar && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.aadhaar}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in space-y-5">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-brand-950">
                <Briefcase className="h-5 w-5 text-brand-600" /> {t.s2title}
              </h2>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">{t.skill}</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {SKILLS.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => set("skill", s.value)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center transition-all ${
                        form.skill === s.value
                          ? "border-brand-600 bg-brand-50 text-brand-700 shadow-md shadow-brand-100"
                          : "border-slate-200 text-slate-600 hover:border-brand-300 hover:bg-brand-50/50"
                      }`}
                    >
                      <SkillIcon skill={s.value} className="h-6 w-6" />
                      <span className="text-[11px] font-bold leading-tight">{skillName(s.value, s.label)}</span>
                    </button>
                  ))}
                </div>
                {errors.skill && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.skill}</p>}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">{t.experience}</label>
                  <select className={`${inputCls} pl-4`} value={form.experience} onChange={(e) => set("experience", e.target.value)}>
                    <option value="">{t.selectExperience}</option>
                    {EXPERIENCE_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                  {errors.experience && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.experience}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">{t.dailyRate}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                    <input className={inputCls} placeholder={t.ratePh} inputMode="numeric" value={form.dailyRate} onChange={(e) => set("dailyRate", e.target.value.replace(/\D/g, ""))} />
                  </div>
                  {errors.dailyRate && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.dailyRate}</p>}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">{t.city}</label>
                  <input className={`${inputCls} pl-4`} placeholder={t.cityPh} value={form.city} onChange={(e) => set("city", e.target.value)} />
                  {errors.city && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.city}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">{t.area}</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input className={inputCls} placeholder={t.areaPh} list="area-list" value={form.area} onChange={(e) => set("area", e.target.value)} />
                    <datalist id="area-list">
                      {Object.keys(AREA_COORDS).map((a) => (<option key={a} value={a} />))}
                    </datalist>
                  </div>
                  {errors.area && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.area}</p>}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">{t.landmark}</label>
                  <input className={`${inputCls} pl-4`} placeholder={t.landmarkPh} value={form.landmark} onChange={(e) => set("landmark", e.target.value)} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">{t.languages}</label>
                  <input className={`${inputCls} pl-4`} placeholder={t.languagesPh} value={form.languages} onChange={(e) => set("languages", e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in space-y-5">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-brand-950">
                <KeyRound className="h-5 w-5 text-brand-600" /> {t.s3title}
              </h2>
              <p className="rounded-xl border border-brand-100 bg-brand-50 p-3.5 text-xs font-medium leading-relaxed text-brand-700">
                {t.s3note}
              </p>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">{t.username}</label>
                <div className="relative">
                  <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input className={inputCls} placeholder={t.usernamePh} value={form.username} onChange={(e) => set("username", e.target.value.toLowerCase())} />
                </div>
                <p className="mt-1.5 text-xs text-slate-400">{t.usernameNote}</p>
                {errors.username && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.username}</p>}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">{t.password}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input type="password" className={inputCls} placeholder={t.passwordPh} value={form.password} onChange={(e) => set("password", e.target.value)} />
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.password}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">{t.confirm}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input type="password" className={inputCls} placeholder={t.confirmPh} value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} />
                  </div>
                  {errors.confirmPassword && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <input type="checkbox" checked={form.agree} onChange={(e) => set("agree", e.target.checked)} className="mt-0.5 h-4 w-4 accent-brand-700" />
                <span className="text-xs leading-relaxed text-slate-600">{t.terms}</span>
              </label>
              {errors.agree && <p className="-mt-2 text-xs font-semibold text-red-500">{errors.agree}</p>}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button onClick={() => setStep((s) => s - 1)} className="flex items-center gap-1.5 rounded-xl border-2 border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50">
                <ArrowLeft className="h-4 w-4" /> {t.back}
              </button>
            ) : (
              <Link href="/" className="flex items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-bold text-slate-400 hover:text-slate-600">
                <ArrowLeft className="h-4 w-4" /> {t.homeBtn}
              </Link>
            )}

            {step < 3 ? (
              <button onClick={next} className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-800 to-brand-950 px-7 py-3 text-sm font-extrabold text-white shadow-lg shadow-brand-200 transition-all hover:-translate-y-0.5">
                {t.next}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button onClick={submit} disabled={loading} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-7 py-3 text-sm font-extrabold text-brand-950 shadow-lg shadow-amber-200 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> {t.registering}</>) : (<><CheckCircle2 className="h-4 w-4" /> {t.registerNow}</>)}
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          {t.haveAccount}{" "}
          <Link href="/login" className="font-bold text-brand-600 hover:underline">
            {t.loginHere}
          </Link>
        </p>
      </div>
    </div>
  );
}

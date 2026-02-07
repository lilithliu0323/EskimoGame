"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import {
  SCENES,
  SCENE_INTROS,
  FORTUNE_TYPES,
  FORTUNE_TYPE_INTROS,
  type SceneId,
  type FortuneTypeId,
} from "@/lib/fortune";

const VALID_TYPES: FortuneTypeId[] = ["tarot", "bazi", "constellation", "ziwei"];
const NEEDS_BIRTH_TIME: FortuneTypeId[] = ["bazi", "ziwei"];
const NEEDS_GENDER: FortuneTypeId[] = ["bazi", "ziwei"];
const NEEDS_BIRTH_DATE: FortuneTypeId[] = ["bazi", "constellation", "ziwei"];

function FortuneForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") as FortuneTypeId | null;
  const type: FortuneTypeId =
    typeParam && VALID_TYPES.includes(typeParam) ? typeParam : "tarot";

  const [scene, setScene] = useState<SceneId>("emotion");
  const [description, setDescription] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [extra, setExtra] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const typeInfo = FORTUNE_TYPES.find((t) => t.id === type);
  const needsBirthDate = NEEDS_BIRTH_DATE.includes(type);
  const needsBirthTime = NEEDS_BIRTH_TIME.includes(type);
  const needsGender = NEEDS_GENDER.includes(type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!description.trim()) {
      setError("请用一句话描述你当下的状态");
      return;
    }
    if (description.length > 80) {
      setError("描述请控制在 80 字以内");
      return;
    }
    if (needsBirthDate && !birthDate) {
      setError(type === "constellation" ? "请选择出生日期" : "请填写出生年月日");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/fortune/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          scene,
          description: description.trim(),
          birthDate: birthDate || undefined,
          birthTime: birthTime || undefined,
          gender: needsGender ? gender : undefined,
          extra: extra.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "请求失败");
      router.push(`/result/${data.sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "解读生成失败，请稍后重试");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50/30">
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="text-2xl">{typeInfo?.icon}</span>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">
                {typeInfo?.label} · 我们开始吧
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {FORTUNE_TYPE_INTROS[type]}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                当下最困扰你的是？
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {SCENES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setScene(s.id)}
                    className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                      scene === s.id
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                用一句话描述当下的状态 <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="例如：刚分手一个月，不知道还要不要等"
                maxLength={80}
                rows={3}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {description.length}/80 字
              </p>
            </div>

            {needsBirthDate && (
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  出生年月日
                  {type === "constellation" ? (
                    <span className="text-slate-400">（用于星座）</span>
                  ) : (
                    <span className="text-rose-500">*</span>
                  )}
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
                />
              </div>
            )}

            {needsBirthTime && (
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  出生时辰 <span className="text-slate-400">（可选，尽量填写）</span>
                </label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
                />
              </div>
            )}

            {needsGender && (
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  性别
                </label>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setGender("male")}
                    className={`rounded-lg px-4 py-2 text-sm ${
                      gender === "male"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    男
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("female")}
                    className={`rounded-lg px-4 py-2 text-sm ${
                      gender === "female"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    女
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700">
                一句话补充 <span className="text-slate-400">(可选)</span>
              </label>
              <input
                type="text"
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                placeholder="例如：最近工作压力很大"
                maxLength={30}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
              />
            </div>

            {error && <p className="text-sm text-rose-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-3.5 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "正在为你解读…" : "开始解读"}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}

export default function FortunePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      }
    >
      <FortuneForm />
    </Suspense>
  );
}

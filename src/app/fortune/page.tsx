"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { SCENES, SCENE_INTROS, type SceneId } from "@/lib/fortune";

function FortuneForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sceneParam = searchParams.get("scene") as SceneId | null;
  const scene = sceneParam && ["emotion", "career", "low"].includes(sceneParam)
    ? sceneParam
    : "emotion";

  const [description, setDescription] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [extra, setExtra] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sceneInfo = SCENES.find((s) => s.id === scene);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!description.trim()) {
      setError("请用一句话描述你当下的状态");
      return;
    }
    if (description.length > 50) {
      setError("描述请控制在 50 字以内");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/fortune/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scene,
          description: description.trim(),
          birthDate: birthDate || undefined,
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
            <span className="text-2xl">{sceneInfo?.icon}</span>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">
                你选择了 {sceneInfo?.label}，我们开始吧
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {SCENE_INTROS[scene]}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                用一句话描述当下的状态 <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="例如：刚分手一个月，不知道还要不要等"
                maxLength={50}
                rows={3}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {description.length}/50 字
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                出生年月日 <span className="text-slate-400">(可选)</span>
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
              />
            </div>

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
              <p className="mt-1 text-right text-xs text-slate-400">
                {extra.length}/30 字
              </p>
            </div>

            {error && (
              <p className="text-sm text-rose-500">{error}</p>
            )}

            <p className="text-center text-xs text-slate-500">
              免费获得首段解读，完整版需解锁
            </p>

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
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    }>
      <FortuneForm />
    </Suspense>
  );
}

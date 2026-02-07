"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Lock, Sparkles } from "lucide-react";
import type { FortuneContent } from "@/lib/fortune";

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [content, setContent] = useState<FortuneContent | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [showEmpathy, setShowEmpathy] = useState(false);
  const [showNarrative, setShowNarrative] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/fortune/result/${sessionId}`)
      .then((res) => {
        if (!res.ok) throw new Error("解读不存在");
        return res.json();
      })
      .then((data) => {
        setContent(data.content);
        setIsUnlocked(data.isUnlocked);
        setShowEmpathy(true);
      })
      .catch(() => router.push("/"))
      .finally(() => setLoading(false));
  }, [sessionId, router]);

  useEffect(() => {
    if (!showEmpathy) return;
    const t = setTimeout(() => setShowNarrative(true), 1200);
    return () => clearTimeout(t);
  }, [showEmpathy]);

  useEffect(() => {
    if (!showNarrative || !isUnlocked) return;
    const t = setTimeout(() => setShowSuggestions(true), 800);
    return () => clearTimeout(t);
  }, [showNarrative, isUnlocked]);

  const handleUnlock = async () => {
    setUnlockLoading(true);
    try {
      const res = await fetch("/api/fortune/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIsUnlocked(true);
      setShowSuggestions(true);
    } catch {
      setUnlockLoading(false);
    } finally {
      setUnlockLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-indigo-50/30">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 rounded-full border-2 border-indigo-500 border-t-transparent"
        />
        <p className="mt-4 text-slate-600">正在为你解读…</p>
      </main>
    );
  }

  if (!content) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50/30">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-2 text-indigo-600"
        >
          <Sparkles className="h-5 w-5" />
          <span className="font-medium">你的解读来了</span>
        </motion.div>

        <div className="space-y-8">
          {/* 共情段 - 免费 */}
          <AnimatePresence>
            {showEmpathy && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="mb-3 text-sm font-medium text-indigo-600">
                  共情
                </h3>
                <p className="leading-relaxed text-slate-700">
                  {content.empathy}
                </p>
              </motion.section>
            )}
          </AnimatePresence>

          {/* 运势叙事段 - 部分免费 + 解锁 */}
          <AnimatePresence>
            {showNarrative && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="mb-3 text-sm font-medium text-indigo-600">
                  运势解读
                </h3>
                {isUnlocked ? (
                  <p className="leading-relaxed text-slate-700">
                    {content.narrative}
                  </p>
                ) : (
                  <>
                    <p className="leading-relaxed text-slate-700 line-clamp-3">
                      {content.narrative}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Lock className="h-4 w-4" />
                        <span className="text-sm">完整解读已折叠</span>
                      </div>
                      <button
                        onClick={handleUnlock}
                        disabled={unlockLoading}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-70"
                      >
                        {unlockLoading ? "解锁中…" : "¥9.9 解锁完整解读"}
                      </button>
                    </div>
                  </>
                )}
              </motion.section>
            )}
          </AnimatePresence>

          {/* 建议段 - 付费后展示 */}
          <AnimatePresence>
            {(isUnlocked ? showSuggestions : false) && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6"
              >
                <h3 className="mb-3 text-sm font-medium text-indigo-600">
                  专属行动建议
                </h3>
                <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
                  {content.suggestions}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* 未解锁时的建议段引导 */}
          {showNarrative && !isUnlocked && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/30 p-6"
            >
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between">
                <div>
                  <p className="font-medium text-slate-700">
                    获取专属行动建议
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    2~3 条可执行的小事，帮你迈出第一步
                  </p>
                </div>
                <button
                  onClick={handleUnlock}
                  disabled={unlockLoading}
                  className="shrink-0 rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-70"
                >
                  {unlockLoading ? "解锁中…" : "¥9.9 解锁完整版"}
                </button>
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </main>
  );
}

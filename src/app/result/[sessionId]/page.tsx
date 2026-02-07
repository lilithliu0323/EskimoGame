"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { FortuneContent } from "@/lib/fortune";

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [content, setContent] = useState<FortuneContent | null>(null);
  const [loading, setLoading] = useState(true);
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
        setShowEmpathy(true);
      })
      .catch(() => router.push("/"))
      .finally(() => setLoading(false));
  }, [sessionId, router]);

  useEffect(() => {
    if (!showEmpathy) return;
    const t = setTimeout(() => setShowNarrative(true), 800);
    return () => clearTimeout(t);
  }, [showEmpathy]);

  useEffect(() => {
    if (!showNarrative) return;
    const t = setTimeout(() => setShowSuggestions(true), 600);
    return () => clearTimeout(t);
  }, [showNarrative]);

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
                <p className="leading-relaxed text-slate-700">
                  {content.narrative}
                </p>
              </motion.section>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSuggestions && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6"
              >
                <h3 className="mb-3 text-sm font-medium text-indigo-600">
                  行动建议
                </h3>
                <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
                  {content.suggestions}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

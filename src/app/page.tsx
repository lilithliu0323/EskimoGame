"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SCENES } from "@/lib/fortune";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50/30">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
            懂你的彷徨，不是迷信，是共情
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            用 AI 帮你理清当下的情绪与方向
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 grid gap-4 sm:grid-cols-3"
        >
          {SCENES.map((scene, i) => (
            <Link
              key={scene.id}
              href={`/fortune?scene=${scene.id}`}
              className="group"
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
              >
                <span className="text-3xl">{scene.icon}</span>
                <h3 className="mt-3 font-semibold text-slate-800">
                  {scene.label}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{scene.desc}</p>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 rounded-xl border border-slate-200 bg-white/80 p-6 backdrop-blur"
        >
          <p className="text-center text-sm text-slate-600">
            基于心理学 + 叙事疗法的 AI 解读 · 不预测未来，只帮你读懂当下
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 space-y-3"
        >
          <p className="text-center text-xs text-slate-500">他人反馈</p>
          <div className="space-y-2 rounded-lg bg-slate-100/80 p-4 text-sm text-slate-600">
            <p>「没想到 AI 能这么懂我在说什么…」</p>
            <p>「建议很具体，不是那种空话」</p>
            <p>「读完心里舒服多了」</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

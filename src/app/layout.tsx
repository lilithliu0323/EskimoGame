import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "懂你的彷徨 | AI 人生阶段解读",
  description:
    "不是迷信，是共情。用 AI 帮你理清当下的情绪与方向。基于心理学与叙事疗法的 AI 解读。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

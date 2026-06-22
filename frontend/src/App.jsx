import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ImageAI from "./pages/ImageAI";
import ObjectRemover from "./pages/ObjectRemover";
import PDFTool from "./pages/PDFTool";
import DocxToPDF from "./pages/DocxToPDF";
import EnhanceAI from "./pages/EnhanceAI";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import UpscalerAI from "./pages/UpscalerAI";
import AIChat from "./pages/AIChat";
import { pingBackend } from "./lib/api";

const tools = [
  {
    title: "Fast & Stable Object Remover",
    icon: "🧹",
    path: "/object-remover",
    description: "Upload an image, paint the unwanted object, and remove it cleanly.",
  },
  {
    title: "Background Remover",
    icon: "🖼",
    path: "/image-ai",
    description: "Remove a photo background in one click.",
  },
  {
    title: "AI Image Enhancer",
    icon: "✨",
    path: "/enhance-ai",
    description: "Improve brightness, contrast, and sharpness with AI.",
  },
  {
    title: "AI Photo Upscaler",
    icon: "🔥",
    path: "/upscale-ai",
    description: "Upscale low-resolution images instantly.",
  },
  {
    title: "AI Resume Analyzer",
    icon: "⭐",
    path: "/resume-ai",
    description: "Analyze your resume and get keyword suggestions.",
  },
  {
    title: "AI Chat Assistant",
    icon: "💬",
    path: "/ai-chat",
    description: "Ask the app for deployment and workflow guidance.",
  },
];

function Dashboard() {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-hero-pattern/50 p-8 shadow-soft dark:border-slate-800/80 dark:bg-slate-900/85">
        <div className="absolute -left-40 -top-20 z-0 h-80 w-80 rounded-full bg-gradient-to-r from-brand-50 to-brand-500 opacity-30 blur-3xl animate-blob"></div>
        <div className="absolute right-[-120px] bottom-[-60px] z-0 h-96 w-96 rounded-full bg-gradient-to-r from-indigo-300 to-cyan-200 opacity-20 blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="relative z-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-600">ToolHubAI</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">AI toolkit for image cleanup, documents, and smart assistance</h1>
            </div>
            <p className="max-w-xl text-slate-500 dark:text-slate-400">
              Use the new object remover, drag and drop uploads, dark mode, and AI chat to accelerate your workflow.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.path} to={tool.path}>
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} className="group rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-soft transition hover:border-brand-500 hover:bg-brand-50/50 dark:border-slate-800/80 dark:bg-slate-950/85">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl shadow-sm dark:bg-slate-900">
                {tool.icon}
              </div>
              <h2 className="mt-5 text-xl font-semibold text-slate-950 dark:text-white">{tool.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{tool.description}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition group-hover:text-brand-700">
                Open tool →
              </div>
            </motion.div>
          </Link>
        ))}
      </section>
    </motion.div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [backendStatus, setBackendStatus] = useState("waking"); // "waking" | "ok" | "error"

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Ping backend on mount to warm it up from Render's free-tier sleep
  useEffect(() => {
    let cancelled = false;
    pingBackend().then((alive) => {
      if (!cancelled) setBackendStatus(alive ? "ok" : "error");
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:flex-row xl:items-start">
          <Sidebar />

          <main className="flex-1">
            <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-soft dark:border-slate-800/80 dark:bg-slate-900/85">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-brand-600">ToolHubAI</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setDarkMode((prev) => !prev)} className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100" aria-label="Toggle dark mode">
                    {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                  </button>
                </div>
              </div>

              <Topbar onNew={() => alert('Create new project coming soon')} />
            </div>

            {/* Backend status banner */}
            {backendStatus === "waking" && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-800 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-400"></span>
                <span><strong>Server is waking up…</strong> Render's free tier sleeps after 15 min. Your first request may take up to 60 seconds.</span>
              </div>
            )}
            {backendStatus === "ok" && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-3 text-sm text-green-800 dark:border-green-700/50 dark:bg-green-900/20 dark:text-green-300">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                <span><strong>Server is online</strong> — all tools are ready to use.</span>
              </div>
            )}
            {backendStatus === "error" && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-800 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-300">
                <span className="inline-block h-2 w-2 rounded-full bg-red-500"></span>
                <span><strong>Backend unreachable.</strong> The server may be redeploying. Please wait a minute and refresh.</span>
              </div>
            )}

            <div className="mt-6">
              <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/image-ai" element={<ImageAI />} />
              <Route path="/object-remover" element={<ObjectRemover />} />
              <Route path="/pdf-tool" element={<PDFTool />} />
              <Route path="/docx-pdf" element={<DocxToPDF />} />
              <Route path="/enhance-ai" element={<EnhanceAI />} />
              <Route path="/resume-ai" element={<ResumeAnalyzer />} />
              <Route path="/upscale-ai" element={<UpscalerAI />} />
              <Route path="/ai-chat" element={<AIChat />} />
            </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

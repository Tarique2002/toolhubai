import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../lib/api";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    const newEntry = { role: "user", text: message.trim() };
    setChat((prev) => [...prev, newEntry]);
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/chat-assistant", {
        message: newEntry.text,
      });

      setChat((prev) => [
        ...prev,
        { role: "assistant", text: res.data.answer },
      ]);
    } catch (error) {
      console.error(error);
      const msg = error.code === "ECONNABORTED"
        ? "The server is waking up — please wait 30 seconds and try again."
        : "Sorry, I couldn't reach the assistant. Please try again.";
      setChat((prev) => [
        ...prev,
        { role: "assistant", text: msg },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Cold-start notice */}
        <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300">
          ⏳ <strong>First request may take ~30–60 seconds</strong> — the server wakes up on demand. Subsequent requests are fast.
        </div>

        <div className="mb-8 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-soft dark:border-slate-800/80 dark:bg-slate-900/85">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-600">AI Assistant</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Chat with your in-app AI helper</h1>
            </div>
            <Link className="inline-flex items-center rounded-2xl border border-slate-200/80 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" to="/">
              ← Dashboard
            </Link>
          </div>
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            Ask deployment questions, tool usage tips, or how to get the best results from your image workflows.
          </p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
          <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-soft dark:border-slate-800/80 dark:bg-slate-900/85">
            <div className="space-y-4">
              {chat.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300/80 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-700/80 dark:bg-slate-950/70 dark:text-slate-400">
                  Start the conversation by asking a question.
                </div>
              ) : (
                chat.map((entry, index) => (
                  <div key={index} className={`rounded-3xl p-5 ${entry.role === "assistant" ? "bg-brand-50 text-slate-950 dark:bg-brand-500/10 dark:text-white" : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"}`}>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{entry.role === "assistant" ? "Assistant" : "You"}</p>
                    <p className="mt-3 whitespace-pre-line leading-7">{entry.text}</p>
                  </div>
                ))
              )}
              {loading && (
                <div className="rounded-3xl bg-brand-50 p-5 dark:bg-brand-500/10">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Assistant</p>
                  <p className="mt-3 text-slate-500 dark:text-slate-400">Thinking…</p>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-soft dark:border-slate-800/80 dark:bg-slate-900/85">
            <label htmlFor="message" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Send a message
            </label>
            <textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-brand-400 dark:focus:ring-brand-500/10"
              placeholder="Ask me how to remove an object, deploy the app live, or use the tools..."
            />
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">Pro tip: ask for deployment instructions or how to use the object remover.</p>
              <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-3xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Thinking..." : "Send Message"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

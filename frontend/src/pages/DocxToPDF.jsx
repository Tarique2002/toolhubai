import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function DocxToPDF() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleConvert = async () => {
    if (!file) {
      setError("Please upload a DOCX file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/docx-to-pdf", formData, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "converted.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccess(true);
    } catch (err) {
      console.error(err);
      if (err.code === "ECONNABORTED") {
        setError("Request timed out. The server may be waking up — please try again in 30 seconds.");
      } else {
        setError("Conversion failed. Please make sure your file is a valid .docx and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-soft dark:border-slate-800/80 dark:bg-slate-900/85">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-600">DOCX Converter</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">DOCX → PDF</h1>
              <p className="mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
                Convert Word documents to PDF quickly and preserve formatting.
              </p>
            </div>
            <Link className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" to="/">
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* Cold-start notice */}
        <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300">
          ⏳ <strong>First request may take ~30–60 seconds</strong> — the server wakes up on demand. Subsequent requests are fast.
        </div>

        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-soft dark:border-slate-800/80 dark:bg-slate-900/85">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">Select DOCX</label>
          <input type="file" accept=".docx" onChange={(e) => { setFile(e.target.files[0]); setError(null); setSuccess(false); }} className="mt-4 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-brand-400 dark:focus:ring-brand-500/10" />
          <button onClick={handleConvert} disabled={loading} className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-brand-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Converting…" : "Convert DOCX"}
          </button>
          {loading && <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Converting your document — this may take a moment…</p>}
          {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</p>}
          {success && <p className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">✅ Conversion complete! Your download should have started.</p>}
        </div>
      </div>
    </div>
  );
}

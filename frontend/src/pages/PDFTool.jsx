import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PDFTool() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!file) {
      alert("Please upload a PDF");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/pdf-to-docx", formData, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "converted.docx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      alert("Conversion failed");
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
              <p className="text-sm uppercase tracking-[0.35em] text-brand-600">PDF Converter</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">PDF → DOCX</h1>
              <p className="mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
                Upload a PDF and download a converted DOCX document instantly.
              </p>
            </div>
            <Link className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" to="/">
              ← Dashboard
            </Link>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-soft dark:border-slate-800/80 dark:bg-slate-900/85">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">Select PDF</label>
          <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="mt-4 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-brand-400 dark:focus:ring-brand-500/10" />
          <button onClick={handleConvert} disabled={loading} className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-brand-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
            Convert PDF
          </button>
          {loading && <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Converting...</p>}
        </div>
      </div>
    </div>
  );
}

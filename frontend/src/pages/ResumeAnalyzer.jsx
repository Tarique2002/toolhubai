import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeResume = async () => {
    if (!file) {
      alert("Upload resume first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:8000/analyze-resume", formData);
      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-soft dark:border-slate-800/80 dark:bg-slate-900/85">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Resume Analyzer</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">AI Resume Feedback</h1>
              <p className="mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
                Upload a resume and get an instant score, keyword matches, and improvement tips.
              </p>
            </div>
            <Link className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" to="/">
              ← Dashboard
            </Link>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-soft dark:border-slate-800/80 dark:bg-slate-900/85">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">Upload PDF or DOCX</label>
          <input type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files[0])} className="mt-4 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-brand-400 dark:focus:ring-brand-500/10" />
          <button onClick={analyzeResume} disabled={loading} className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-brand-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
            Analyze Resume
          </button>
          {loading && <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Analyzing...</p>}

          {result && (
            <div className="mt-10 space-y-6 rounded-[32px] border border-slate-200/80 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950/70">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Resume Score</h2>
                  <p className="text-4xl font-bold text-brand-600">{result.score}/100</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Skills Found</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {result.skills.map((skill, index) => (
                      <li key={index} className="rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-950">{skill}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Suggestions</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {result.suggestions.map((item, index) => (
                      <li key={index} className="rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-950">{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">ATS Tips</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {result.ats_tips.map((tip, index) => (
                      <li key={index} className="rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-950">{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

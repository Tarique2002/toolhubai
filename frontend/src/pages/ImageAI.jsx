import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ImageAI() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleRemove = async () => {
    if (!file) {
      alert("Please upload an image first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:8000/remove-bg", formData);
      setResult(res.data.image);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
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
              <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Background Remover</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">AI Background Removal</h1>
              <p className="mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
                Remove the background from photos instantly. Upload a file and let the AI return a transparent PNG.
              </p>
            </div>
            <Link className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" to="/">
              ← Dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
          <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-soft dark:border-slate-800/80 dark:bg-slate-900/85">
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">Upload image</label>
            <input type="file" accept="image/*" onChange={handleFile} className="mt-4 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-brand-400 dark:focus:ring-brand-500/10" />
            <button onClick={handleRemove} disabled={loading} className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-brand-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
              Remove Background
            </button>
            {loading && <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Processing image...</p>}
          </div>

          <div className="space-y-6">
            {preview && (
              <div className="rounded-[32px] border border-slate-200/80 bg-slate-50 p-6 shadow-soft dark:border-slate-800/80 dark:bg-slate-950/70">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Original</h2>
                <img src={preview} alt="preview" className="mt-4 w-full rounded-3xl object-cover" />
              </div>
            )}

            {result && (
              <div className="rounded-[32px] border border-slate-200/80 bg-slate-50 p-6 shadow-soft dark:border-slate-800/80 dark:bg-slate-950/70">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Result</h2>
                <img src={`data:image/png;base64,${result}`} alt="background removed" className="mt-4 w-full rounded-3xl object-cover" />
                <a href={`data:image/png;base64,${result}`} download="background-removed.png" className="mt-6 inline-flex rounded-3xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
                  Download Image
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

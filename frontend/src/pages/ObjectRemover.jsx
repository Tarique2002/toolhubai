import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ObjectRemover() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [brushSize, setBrushSize] = useState(28);
  const [drawing, setDrawing] = useState(false);
  const [status, setStatus] = useState("Upload an image and paint the object you want removed.");
  const [dragActive, setDragActive] = useState(false);

  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const lastPointRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!preview || !imageRef.current || !canvasRef.current) {
      return;
    }

    const image = new Image();
    image.src = preview;
    image.onload = () => {
      const canvas = canvasRef.current;
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setResult(null);
    };
  }, [preview]);

  const getCanvasCoordinates = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (event) => {
    if (!canvasRef.current) return;
    const { x, y } = getCanvasCoordinates(event);
    lastPointRef.current = { x, y };
    setDrawing(true);
    drawLine(x, y, x, y);
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const drawLine = (startX, startY, endX, endY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "white";
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  };

  const handlePointerMove = (event) => {
    if (!drawing || !canvasRef.current) return;
    const { x, y } = getCanvasCoordinates(event);
    const lastPoint = lastPointRef.current;
    drawLine(lastPoint.x, lastPoint.y, x, y);
    lastPointRef.current = { x, y };
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setStatus("Paint over the object with the brush, then press Remove Object.");
  };

  const handleInputFile = (event) => {
    handleFile(event.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  const handleClear = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setResult(null);
    setStatus("Mask cleared. Paint the object again if needed.");
  };

  const handleRemove = async () => {
    if (!file) {
      alert("Please upload an image first.");
      return;
    }

    if (!canvasRef.current) {
      alert("Mask canvas is not ready.");
      return;
    }

    setLoading(true);
    setStatus("Sending image to the backend for removal...");

    const maskBlob = await new Promise((resolve) => canvasRef.current.toBlob(resolve, "image/png"));
    if (!maskBlob) {
      setLoading(false);
      alert("Failed to build the mask. Try again.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mask", maskBlob, "mask.png");

    try {
      const response = await axios.post("http://127.0.0.1:8000/remove-object", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data.image);
      setStatus("Object removed successfully. Download your cleaned image.");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Make sure the backend is running.");
      setStatus("Failed to remove object. Check the backend and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-soft dark:border-slate-800/80 dark:bg-slate-900/85 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Object Remover</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Fast & Stable Object Remover</h1>
            <p className="mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
              Upload a photo, drag or click to drop the unwanted object, paint over it, and remove it with AI-powered inpainting.
            </p>
          </div>
          <Link className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" to="/">
            ← Dashboard
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr,0.9fr]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-soft dark:border-slate-800/80 dark:bg-slate-900/85">
            <div className="space-y-6">
              <label className="block rounded-3xl border border-dashed border-slate-300/80 bg-slate-50 p-8 text-center transition hover:border-brand-500 hover:bg-brand-50/50 dark:border-slate-700 dark:bg-slate-950/70 dark:hover:border-brand-400" onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={handleDrop}>
                <input type="file" accept="image/*" onChange={handleInputFile} className="sr-only" />
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm dark:bg-slate-900">
                  <span className="text-3xl">📤</span>
                </div>
                <p className="mt-4 text-lg font-semibold">Drag & drop an image, or click to upload</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Supported formats: JPG, PNG, WEBP</p>
                {dragActive && <p className="mt-4 text-sm text-brand-600">Drop the file to upload</p>}
              </label>

              <div className="grid gap-4 sm:grid-cols-[0.8fr,1.2fr]">
                <div className="space-y-3 rounded-3xl border border-slate-200/80 bg-slate-50 p-5 dark:border-slate-700/80 dark:bg-slate-950/70">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Brush size</p>
                  <input type="range" min="8" max="80" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-full" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button onClick={handleRemove} disabled={loading} className="rounded-3xl bg-brand-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
                    Remove Object
                  </button>
                  <button onClick={handleClear} className="rounded-3xl border border-slate-300 px-5 py-4 text-sm font-semibold text-slate-900 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-100">
                    Clear Mask
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700/80 dark:bg-slate-950/70 dark:text-slate-300">
                {loading ? "Processing your image..." : status}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-soft dark:border-slate-800/80 dark:bg-slate-900/85">
            <h2 className="text-2xl font-semibold">Paint Mask</h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">Mark the object you want removed with a white stroke over the preview. The backend uses this mask to clean the photo.</p>

            <div className={`mt-6 relative overflow-hidden rounded-3xl border-2 ${preview ? "border-brand-500/40" : "border-slate-200/80 dark:border-slate-700/80"} bg-slate-100 dark:bg-slate-950`}>
              {preview ? (
                <div className="relative">
                  <img ref={imageRef} src={preview} alt="Upload preview" className="block w-full" />
                  <canvas
                    ref={canvasRef}
                    onPointerDown={startDrawing}
                    onPointerMove={handlePointerMove}
                    onPointerUp={stopDrawing}
                    onPointerLeave={stopDrawing}
                    className="absolute inset-0 h-full w-full cursor-crosshair"
                  />
                </div>
              ) : (
                <div className="flex min-h-[420px] items-center justify-center p-10 text-center text-slate-500 dark:text-slate-400">
                  Upload an image to start drawing the removal mask.
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-soft dark:border-slate-800/80 dark:bg-slate-900/85">
            <h2 className="text-2xl font-semibold">Cleaned Image</h2>
            <img src={`data:image/png;base64,${result}`} alt="Cleaned result" className="mt-6 w-full rounded-3xl border border-slate-200/80 dark:border-slate-800/80" />
            <a href={`data:image/png;base64,${result}`} download="cleaned-image.png" className="mt-6 inline-flex rounded-3xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
              Download Clean Image
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}

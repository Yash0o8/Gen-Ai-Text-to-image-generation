import { useState } from "react";
import { upscaleImage } from "../services/api";

export default function ImagePreview({ loading, image, meta, onImageUpdate }) {
  const [scale, setScale] = useState(2);
  const [upscaling, setUpscaling] = useState(false);

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = "genai-image.png";
    link.click();
  };

  const handleUpscale = async () => {
    if (!image) return;

    try {
      setUpscaling(true);

      // remove data:image/png;base64,
      const base64 = image.split(",")[1];

      const result = await upscaleImage({
        image: base64,
        scale,
      });

      // ✅ SAFETY GUARD
      if (typeof onImageUpdate === "function") {
        onImageUpdate(`data:image/png;base64,${result.image}`);
      }
    } catch (err) {
      alert(err.message || "Upscaling failed");
    } finally {
      setUpscaling(false);
    }
  };

  return (
    <div
      className="
        w-1/2 bg-white dark:bg-slate-900
        rounded-2xl shadow-sm dark:shadow-lg
        p-4 flex items-center justify-center
        transition-colors
      "
    >
      {/* Loading */}
      {loading && (
        <div className="w-full h-full rounded-xl animate-pulse bg-slate-200 dark:bg-slate-800" />
      )}

      {/* Image */}
      {!loading && image && (
        <div className="flex flex-col items-center gap-4 w-full">
          <img
            src={image}
            alt="Generated"
            className="max-h-[70vh] max-w-full rounded-xl object-contain"
          />

          {/* Metadata */}
          {meta && (
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              ⏱ {meta.time}s • CFG {meta.cfg} • Steps {meta.steps} •{" "}
              {meta.resolution}
            </p>
          )}

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="
                px-3 py-2 rounded-lg
                bg-slate-100 dark:bg-slate-800
                text-slate-900 dark:text-slate-100
              "
            >
              <option value={2}>2× Upscale</option>
              <option value={4}>4× Upscale</option>
            </select>

            <button
              onClick={handleUpscale}
              disabled={upscaling}
              className="
                px-4 py-2 rounded-lg
                bg-indigo-600 text-white
                hover:bg-indigo-700
                disabled:opacity-50
                transition
              "
            >
              {upscaling ? "Upscaling…" : "Upscale"}
            </button>

            <button
              onClick={handleDownload}
              disabled={!image}
              className="
                px-4 py-2 rounded-lg
                bg-emerald-600 text-white
                hover:bg-emerald-700
                transition
              "
            >
              ⬇️ Download
            </button>
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && !image && (
        <p className="text-slate-500 dark:text-slate-400 text-center">
          🖼️ Your generated image will appear here
        </p>
      )}
    </div>
  );
}

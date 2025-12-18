import { useState } from "react";
import Sidebar from "../components/Sidebar";
import PromptBox from "../components/PromptBox";
import Controls from "../components/Controls";
import ImagePreview from "../components/ImagePreview";
import ThemeToggle from "../components/ThemeToggle";
import { generateImage } from "../services/api";
import { PRESETS } from "../constants/presets";

// 🔹 Default prompt enhancements
const DEFAULT_STYLE =
  "ultra detailed, soft lighting, high quality digital art";

const DEFAULT_NEGATIVE =
  "blurry, low quality, low resolution, deformed, bad anatomy, extra limbs, artifacts";

export default function Generator() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [cfg, setCfg] = useState(7.5);
  const [steps, setSteps] = useState(30);
  const [seed, setSeed] = useState("");
  const [resolution, setResolution] = useState(512);
  const [useLora, setUseLora] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const [history, setHistory] = useState([]);
  const [meta, setMeta] = useState(null);

  const handleImageUpdate = (newImage) => {
  setImage(newImage);
};

  /* -----------------------------
     Preset handler (FIXED)
  ------------------------------ */
  const handlePresetSelect = (presetId) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setPrompt((prev) =>
      prev ? `${prev}, ${preset.prompt}` : preset.prompt
    );
    setCfg(preset.cfg);
    setSteps(preset.steps);
  };

  /* -----------------------------
     Generate image
  ------------------------------ */
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setImage(null);

    try {
      const finalPrompt = prompt.includes(DEFAULT_STYLE)
        ? prompt
        : `${prompt}, ${DEFAULT_STYLE}`;

      const finalNegative = negativePrompt
        ? negativePrompt
        : DEFAULT_NEGATIVE;

      const start = Date.now();

      const result = await generateImage({
        prompt: finalPrompt,
        negative_prompt: finalNegative,
        cfg_scale: cfg,
        steps,
        seed: seed ? Number(seed) : null,
        width: resolution,
        height: resolution,
        use_lora: useLora,
      });

      if (!result || !result.image) {
        throw new Error("No image returned from backend");
      }

      const end = Date.now();
      const imageUrl = `data:image/png;base64,${result.image}`;

      setImage(imageUrl);

      const metaData = {
        time: ((end - start) / 1000).toFixed(1),
        cfg,
        steps,
        seed: seed || "random",
        resolution: `${resolution}×${resolution}`,
        lora: useLora ? "enabled" : "disabled",
        prompt: finalPrompt,
      };

      setMeta(metaData);

      setHistory((prev) => [
        { image: imageUrl, meta: metaData },
        ...prev.slice(0, 9),
      ]);
    } catch (error) {
      console.error("GENERATION ERROR:", error);
      alert(error.message || "Image generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950">
      <Sidebar
        history={history}
        onSelect={(item) => {
          if (!item) {
            setImage(null);
            setMeta(null);
            return;
          }
          setImage(item.image);
          setMeta(item.meta);
        }}
      />

      <main className="flex-1 p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            🎨 Text to Image Generator
          </h1>
          <ThemeToggle />
        </div>

        <div className="flex gap-4 flex-1">
          <div className="w-1/2 flex flex-col gap-4">
            <PromptBox
              prompt={prompt}
              setPrompt={setPrompt}
              negativePrompt={negativePrompt}
              setNegativePrompt={setNegativePrompt}
            />

            <Controls
              cfg={cfg}
              setCfg={setCfg}
              steps={steps}
              setSteps={setSteps}
              seed={seed}
              setSeed={setSeed}
              resolution={resolution}
              setResolution={setResolution}
              useLora={useLora}
              setUseLora={setUseLora}
              loading={loading}
              onGenerate={handleGenerate}
              onPresetSelect={handlePresetSelect}
            />
          </div>

          <ImagePreview
            loading={loading}
            image={image}
            meta={meta}
          />
        </div>
      </main>
    </div>
  );
}

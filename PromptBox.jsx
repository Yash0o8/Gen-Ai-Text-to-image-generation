export default function PromptBox({
  prompt,
  setPrompt,
  negativePrompt,
  setNegativePrompt,
}) {
  const presets = {
    Cinematic:
      "cinematic lighting, ultra realistic, shallow depth of field, dramatic shadows",
    Anime:
      "anime style, vibrant colors, studio ghibli, detailed illustration",
    Realistic:
      "photorealistic, natural lighting, 50mm lens, high detail",
  };

  const applyPreset = (text) => {
    setPrompt((prev) =>
      prev.includes(text) ? prev : `${prev}${prev ? ", " : ""}${text}`
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4">
      {/* Prompt */}
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Prompt
      </label>

      {/* Preset buttons */}
      <div className="flex gap-2 mt-2 mb-2">
        {Object.keys(presets).map((key) => (
          <button
            key={key}
            onClick={() => applyPreset(presets[key])}
            className="
              px-2 py-1 text-xs rounded-lg
              bg-slate-200 dark:bg-slate-800
              text-slate-700 dark:text-slate-300
              hover:bg-indigo-500 hover:text-white
              transition
            "
          >
            {key}
          </button>
        ))}
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        placeholder="Describe the image you want to generate..."
        className="
          w-full p-3 rounded-xl
          bg-slate-100 dark:bg-slate-800
          text-slate-900 dark:text-slate-100
          placeholder-slate-400 dark:placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-indigo-500
        "
      />

      {/* Negative Prompt */}
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-4 block">
        Negative Prompt
      </label>

      <input
        value={negativePrompt}
        onChange={(e) => setNegativePrompt(e.target.value)}
        placeholder="What should be avoided?"
        className="
          w-full mt-2 p-3 rounded-xl
          bg-slate-100 dark:bg-slate-800
          text-slate-900 dark:text-slate-100
          placeholder-slate-400 dark:placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-indigo-500
        "
      />
    </div>
  );
}

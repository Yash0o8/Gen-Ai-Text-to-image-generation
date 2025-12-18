import { PRESETS } from "../constants/presets";

export default function Controls({
  cfg,
  setCfg,
  steps,
  setSteps,
  seed,
  setSeed,
  resolution,
  setResolution,
  useLora,
  setUseLora,
  loading,
  onGenerate,
  onPresetSelect,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 space-y-4">

      {/* Preset Styles */}
      <div>
        <label className="text-sm text-slate-700 dark:text-slate-300">
          Preset Style
        </label>
        <select
          onChange={(e) => onPresetSelect(e.target.value)}
          className="
            w-full mt-1 p-2 rounded-lg
            bg-slate-100 dark:bg-slate-800
            text-slate-900 dark:text-slate-100
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
        >
          <option value="">Custom</option>
          {PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      {/* CFG & Steps */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-700 dark:text-slate-300">
            CFG Scale: {cfg}
          </label>
          <input
            type="range"
            min="1"
            max="15"
            step="0.5"
            value={cfg}
            onChange={(e) => setCfg(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm text-slate-700 dark:text-slate-300">
            Steps: {steps}
          </label>
          <input
            type="range"
            min="10"
            max="50"
            value={steps}
            onChange={(e) => setSteps(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Resolution */}
      <div>
        <label className="text-sm text-slate-700 dark:text-slate-300">
          Resolution
        </label>
        <select
          value={resolution}
          onChange={(e) => setResolution(Number(e.target.value))}
          className="
            w-full mt-1 p-2 rounded-lg
            bg-slate-100 dark:bg-slate-800
            text-slate-900 dark:text-slate-100
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
        >
          <option value={512}>512 × 512 (Fast)</option>
          <option value={640}>640 × 640 (Balanced)</option>
          <option value={768}>768 × 768 (High Quality)</option>
        </select>
      </div>

      {/* LoRA Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={useLora}
          onChange={(e) => setUseLora(e.target.checked)}
          className="accent-indigo-600"
        />
        <label className="text-sm text-slate-700 dark:text-slate-300">
          Enable LoRA (Style Adapter)
        </label>
      </div>

      {/* Seed */}
      <div>
        <label className="text-sm text-slate-700 dark:text-slate-300">
          Seed (optional)
        </label>
        <input
          type="number"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          placeholder="Random if empty"
          className="
            w-full mt-1 p-2 rounded-lg
            bg-slate-100 dark:bg-slate-800
            text-slate-900 dark:text-slate-100
            placeholder-slate-400 dark:placeholder-slate-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
        />
      </div>

      {/* Generate */}
      <button
        onClick={onGenerate}
        disabled={loading}
        className="
          w-full py-3 rounded-xl
          bg-indigo-600 text-white
          hover:bg-indigo-700
          disabled:opacity-50
          transition
        "
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>
    </div>
  );
}

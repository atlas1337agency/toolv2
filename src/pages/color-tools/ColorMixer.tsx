import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, ArrowRightLeft, Blend, Settings2, Download } from 'lucide-react';
import chroma from 'chroma-js';

const MIX_MODES = [
  { value: 'lrgb', label: 'Linear RGB (Best for lighting)' },
  { value: 'rgb', label: 'Standard RGB' },
  { value: 'hsl', label: 'HSL (Hue, Saturation, Lightness)' },
  { value: 'lab', label: 'LAB (Perceptually uniform)' },
  { value: 'lch', label: 'LCH (Cylindrical LAB)' },
  { value: 'oklab', label: 'OKLAB (Modern perceptual)' },
  { value: 'oklch', label: 'OKLCH (Modern cylindrical)' },
];

export function ColorMixer() {
  const [color1, setColor1] = useState('#ff0000');
  const [color2, setColor2] = useState('#0000ff');
  const [steps, setSteps] = useState(5);
  const [mode, setMode] = useState('lrgb');
  const [mixedColors, setMixedColors] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      if (chroma.valid(color1) && chroma.valid(color2)) {
        const scale = chroma.scale([color1, color2]).mode(mode as any).colors(steps);
        setMixedColors(scale);
        setError('');
      } else {
        setError('Invalid HEX color code(s)');
        setMixedColors([]);
      }
    } catch (err) {
      setError('Invalid HEX color code(s)');
      setMixedColors([]);
    }
  }, [color1, color2, steps, mode]);

  const handleCopy = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const cssVars = mixedColors.map((hex, i) => `--color-mix-${i + 1}: ${hex};`).join('\n');
    navigator.clipboard.writeText(cssVars);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleSwap = () => {
    setColor1(color2);
    setColor2(color1);
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:px-6 lg:px-8">
      <Link to="/color-tools" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
        <ArrowLeft className="h-4 w-4" />
        Back to Color Tools
      </Link>
      
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Color Mixer</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Mix 2 colors and get color codes for intermediate colors from 2 to 10 steps.
          </p>
        </div>
        {mixedColors.length > 0 && (
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
          >
            {copiedAll ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
            {copiedAll ? 'Copied CSS' : 'Export CSS'}
          </button>
        )}
      </div>

      <div className="mb-8 flex flex-col gap-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              <Blend className="h-4 w-4" />
              Colors to Mix
            </div>
            
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-end">
              <div className="w-full flex-1 space-y-2">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Color 1</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={chroma.valid(color1) ? chroma(color1).hex() : '#000000'}
                    onChange={(e) => setColor1(e.target.value)}
                    className="h-12 w-16 shrink-0 cursor-pointer rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950"
                  />
                  <input
                    type="text"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    placeholder="#ff0000"
                    className="h-12 flex-1 min-w-0 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-mono focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                  />
                </div>
              </div>

              <button
                onClick={handleSwap}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                title="Swap Colors"
              >
                <ArrowRightLeft className="h-5 w-5 rotate-90 md:rotate-0" />
              </button>

              <div className="w-full flex-1 space-y-2">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Color 2</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={chroma.valid(color2) ? chroma(color2).hex() : '#000000'}
                    onChange={(e) => setColor2(e.target.value)}
                    className="h-12 w-16 shrink-0 cursor-pointer rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950"
                  />
                  <input
                    type="text"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    placeholder="#0000ff"
                    className="h-12 flex-1 min-w-0 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-mono focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                  />
                </div>
              </div>
            </div>
            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              <Settings2 className="h-4 w-4" />
              Mix Settings
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Interpolation Mode</label>
                </div>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                >
                  {MIX_MODES.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Steps</label>
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{steps}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="1"
                  value={steps}
                  onChange={(e) => setSteps(parseInt(e.target.value))}
                  className="h-2 w-full appearance-none rounded-full bg-zinc-200 accent-zinc-900 dark:bg-zinc-800 dark:accent-zinc-50"
                />
              </div>
            </div>
          </div>
      </div>

      {mixedColors.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-32 w-full overflow-hidden rounded-xl shadow-sm">
            {mixedColors.map((hex, idx) => (
              <div
                key={idx}
                className="group relative flex-1 transition-all hover:flex-[1.5]"
                style={{ backgroundColor: hex }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 bg-black/20 backdrop-blur-[2px]">
                  <button
                    onClick={() => handleCopy(hex, idx)}
                    className="flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-zinc-900 shadow-sm hover:bg-white"
                  >
                    {copiedIndex === idx ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {hex}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {mixedColors.map((hex, idx) => {
              const color = chroma(hex);
              const isDark = color.luminance() < 0.5;
              
              return (
                <div 
                  key={idx} 
                  className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl p-4 transition-transform hover:scale-105"
                  style={{ backgroundColor: hex }}
                  onClick={() => handleCopy(hex, idx)}
                >
                  <span className={`text-sm font-mono font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {hex.toUpperCase()}
                  </span>
                  <div className={`absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {copiedIndex === idx ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

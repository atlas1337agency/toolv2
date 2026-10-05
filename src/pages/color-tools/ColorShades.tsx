import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Settings2, Palette, Download } from 'lucide-react';
import chroma from 'chroma-js';

export function ColorShades() {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [stepCount, setStepCount] = useState(5);
  const [lightenStep, setLightenStep] = useState(90);
  const [darkenStep, setDarkenStep] = useState(90);
  const [saturationStep, setSaturationStep] = useState(0);
  const [shades, setShades] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      if (chroma.valid(baseColor)) {
        const color = chroma(baseColor);
        
        const lighter = [];
        for (let i = stepCount; i > 0; i--) {
           const factor = (lightenStep / 100) * (i / stepCount);
           let c = chroma.mix(color, 'white', factor, 'rgb');
           if (saturationStep !== 0) {
             c = saturationStep > 0 ? c.saturate((saturationStep/100) * 3 * (i/stepCount)) : c.desaturate((Math.abs(saturationStep)/100) * 3 * (i/stepCount));
           }
           lighter.push(c.hex());
        }
        
        const darker = [];
        for (let i = 1; i <= stepCount; i++) {
           const factor = (darkenStep / 100) * (i / stepCount);
           let c = chroma.mix(color, 'black', factor, 'rgb');
           if (saturationStep !== 0) {
             c = saturationStep > 0 ? c.saturate((saturationStep/100) * 3 * (i/stepCount)) : c.desaturate((Math.abs(saturationStep)/100) * 3 * (i/stepCount));
           }
           darker.push(c.hex());
        }
        
        setShades([...lighter, color.hex(), ...darker]);
        setError('');
      } else {
        setError('Invalid HEX color code');
        setShades([]);
      }
    } catch (err) {
      setError('Invalid HEX color code');
      setShades([]);
    }
  }, [baseColor, stepCount, lightenStep, darkenStep, saturationStep]);

  const handleCopy = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const cssVars = shades.map((hex, i) => {
      // Create a nice scale like 50, 100, 200... 900
      let weight = i === 0 ? 50 : i * 100;
      if (weight > 950) weight = 950;
      return `--color-shade-${weight}: ${hex};`;
    }).join('\n');
    navigator.clipboard.writeText(cssVars);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:px-6 lg:px-8">
      <Link to="/color-tools" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
        <ArrowLeft className="h-4 w-4" />
        Back to Color Tools
      </Link>
      
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Color Shades Generator</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Get all shades of a color by setting up steps for darken, lighten, saturation and desaturation.
          </p>
        </div>
        {shades.length > 0 && (
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
          >
            {copiedAll ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
            {copiedAll ? 'Copied CSS' : 'Export CSS'}
          </button>
        )}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              <Palette className="h-4 w-4" />
              Base Color
            </div>
            <div className="flex gap-4">
              <input
                type="color"
                value={chroma.valid(baseColor) ? chroma(baseColor).hex() : '#000000'}
                onChange={(e) => setBaseColor(e.target.value)}
                className="h-12 w-16 cursor-pointer rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950"
              />
              <input
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                placeholder="#3b82f6"
                className="h-12 flex-1 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-mono focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
              />
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
        </div>

        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              <Settings2 className="h-4 w-4" />
              Shade Settings
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Step Count (Each Way)</label>
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{stepCount}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={stepCount}
                  onChange={(e) => setStepCount(parseInt(e.target.value))}
                  className="h-2 w-full appearance-none rounded-full bg-zinc-200 accent-zinc-900 dark:bg-zinc-800 dark:accent-zinc-50"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Lighten Max (%)</label>
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{lightenStep}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={lightenStep}
                  onChange={(e) => setLightenStep(parseInt(e.target.value))}
                  className="h-2 w-full appearance-none rounded-full bg-zinc-200 accent-zinc-900 dark:bg-zinc-800 dark:accent-zinc-50"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Darken Max (%)</label>
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{darkenStep}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={darkenStep}
                  onChange={(e) => setDarkenStep(parseInt(e.target.value))}
                  className="h-2 w-full appearance-none rounded-full bg-zinc-200 accent-zinc-900 dark:bg-zinc-800 dark:accent-zinc-50"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Saturate / Desaturate</label>
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{saturationStep > 0 ? '+' : ''}{saturationStep}%</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="5"
                  value={saturationStep}
                  onChange={(e) => setSaturationStep(parseInt(e.target.value))}
                  className="h-2 w-full appearance-none rounded-full bg-zinc-200 accent-zinc-900 dark:bg-zinc-800 dark:accent-zinc-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {shades.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-32 w-full overflow-hidden rounded-xl shadow-sm">
            {shades.map((hex, idx) => (
              <div
                key={idx}
                className="group relative flex-1 transition-all hover:flex-[1.5]"
                style={{ backgroundColor: hex }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 bg-black/20 backdrop-blur-[2px]">
                  <button
                    onClick={() => handleCopy(hex, idx)}
                    className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-white/90 p-1.5 sm:px-3 sm:py-1.5 text-xs font-medium text-zinc-900 shadow-sm hover:bg-white"
                  >
                    {copiedIndex === idx ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span className="hidden sm:inline">{hex}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {shades.map((hex, idx) => {
              const color = chroma(hex);
              const isDark = color.luminance() < 0.5;
              const isBase = idx === stepCount;
              
              return (
                <div 
                  key={idx} 
                  className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl p-4 transition-transform hover:scale-105 ${isBase ? 'ring-2 ring-zinc-900 ring-offset-2 dark:ring-zinc-50 dark:ring-offset-zinc-950' : ''}`}
                  style={{ backgroundColor: hex }}
                  onClick={() => handleCopy(hex, idx)}
                >
                  <span className={`text-sm font-mono font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {hex.toUpperCase()}
                  </span>
                  {isBase && (
                    <span className={`mt-1 text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-white/70' : 'text-black/50'}`}>
                      Base
                    </span>
                  )}
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

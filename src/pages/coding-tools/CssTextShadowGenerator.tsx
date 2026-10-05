import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, ArrowLeft, Check } from 'lucide-react';

export function CssTextShadowGenerator() {
  const [hOffset, setHOffset] = useState(2);
  const [vOffset, setVOffset] = useState(2);
  const [blur, setBlur] = useState(4);
  const [color, setColor] = useState('#000000');
  const [opacity, setOpacity] = useState(0.5);
  const [copied, setCopied] = useState(false);

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getCss = () => {
    const shadowColor = hexToRgba(color, opacity);
    return `text-shadow: ${hOffset}px ${vOffset}px ${blur}px ${shadowColor};`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCss());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-[#111827]/50">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <Link
            to="/coding-tools"
            className="mb-4 inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Coding Tools
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            CSS Text Shadow Generator
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Generate beautiful CSS text shadows to make your typography stand out.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Horizontal Offset ({hOffset}px)
                  </label>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={hOffset}
                    onChange={(e) => setHOffset(Number(e.target.value))}
                    className="w-full accent-zinc-900 dark:accent-zinc-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Vertical Offset ({vOffset}px)
                  </label>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={vOffset}
                    onChange={(e) => setVOffset(Number(e.target.value))}
                    className="w-full accent-zinc-900 dark:accent-zinc-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Blur Radius ({blur}px)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={blur}
                    onChange={(e) => setBlur(Number(e.target.value))}
                    className="w-full accent-zinc-900 dark:accent-zinc-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Opacity ({opacity})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full accent-zinc-900 dark:accent-zinc-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Shadow Color ({color})
                  </label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-full cursor-pointer rounded-xl border border-zinc-200 bg-white p-1 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80 min-h-[300px] flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
              <h2 
                className="text-6xl font-bold text-zinc-900 dark:text-zinc-50"
                style={{
                  textShadow: `${hOffset}px ${vOffset}px ${blur}px ${hexToRgba(color, opacity)}`
                }} 
              >
                Text Shadow
              </h2>
            </div>

            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Generated Code</h3>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
                >
                  {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-xl bg-zinc-950 p-4 text-sm text-zinc-50 dark:bg-zinc-900">
                <code>{getCss()}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

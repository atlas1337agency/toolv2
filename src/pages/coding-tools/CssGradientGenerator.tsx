import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, ArrowLeft, Check } from 'lucide-react';

export function CssGradientGenerator() {
  const [type, setType] = useState('linear');
  const [angle, setAngle] = useState(90);
  const [color1, setColor1] = useState('#f43f5e');
  const [color2, setColor2] = useState('#8b5cf6');
  const [copied, setCopied] = useState(false);

  const getCss = () => {
    if (type === 'linear') {
      return `background: linear-gradient(${angle}deg, ${color1}, ${color2});`;
    } else {
      return `background: radial-gradient(circle, ${color1}, ${color2});`;
    }
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
            CSS Gradient Generator
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Generate beautiful CSS gradients either by using presets or customizing on your own.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                  >
                    <option value="linear">Linear</option>
                    <option value="radial">Radial</option>
                  </select>
                </div>

                {type === 'linear' && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Angle ({angle}°)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={angle}
                      onChange={(e) => setAngle(Number(e.target.value))}
                      className="w-full accent-zinc-900 dark:accent-zinc-50"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Color 1 ({color1})
                  </label>
                  <input
                    type="color"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    className="h-10 w-full cursor-pointer rounded-xl border border-zinc-200 bg-white p-1 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Color 2 ({color2})
                  </label>
                  <input
                    type="color"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    className="h-10 w-full cursor-pointer rounded-xl border border-zinc-200 bg-white p-1 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80 min-h-[300px] flex items-center justify-center">
              <div 
                className="w-full h-full min-h-[300px] rounded-xl"
                style={{
                  background: type === 'linear' ? `linear-gradient(${angle}deg, ${color1}, ${color2})` : `radial-gradient(circle, ${color1}, ${color2})`
                }} 
              />
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

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, ArrowLeft, Check } from 'lucide-react';

export function CssCubicBezierGenerator() {
  const [p1x, setP1x] = useState(0.25);
  const [p1y, setP1y] = useState(0.1);
  const [p2x, setP2x] = useState(0.25);
  const [p2y, setP2y] = useState(1);
  const [duration, setDuration] = useState(1);
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const getCss = () => {
    return `transition-timing-function: cubic-bezier(${p1x}, ${p1y}, ${p2x}, ${p2y});\ntransition-duration: ${duration}s;`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCss());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerAnimation = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 50);
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
            CSS Cubic Bezier Generator
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Generate CSS cubic Bezier easing functions by previewing animation and time-progress graph.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      P1 X ({p1x})
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={p1x}
                      onChange={(e) => setP1x(Number(e.target.value))}
                      className="w-full accent-zinc-900 dark:accent-zinc-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      P1 Y ({p1y})
                    </label>
                    <input
                      type="range"
                      min="-1"
                      max="2"
                      step="0.01"
                      value={p1y}
                      onChange={(e) => setP1y(Number(e.target.value))}
                      className="w-full accent-zinc-900 dark:accent-zinc-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      P2 X ({p2x})
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={p2x}
                      onChange={(e) => setP2x(Number(e.target.value))}
                      className="w-full accent-zinc-900 dark:accent-zinc-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      P2 Y ({p2y})
                    </label>
                    <input
                      type="range"
                      min="-1"
                      max="2"
                      step="0.01"
                      value={p2y}
                      onChange={(e) => setP2y(Number(e.target.value))}
                      className="w-full accent-zinc-900 dark:accent-zinc-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Duration ({duration}s)
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full accent-zinc-900 dark:accent-zinc-50"
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={triggerAnimation}
                    className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Preview Animation
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80 min-h-[300px] flex flex-col items-center justify-center space-y-8">
              <div className="w-full max-w-md bg-zinc-100 dark:bg-zinc-800/50 rounded-xl p-4 relative h-24 overflow-hidden">
                <div 
                  className="w-16 h-16 bg-blue-500 rounded-xl absolute top-4"
                  style={{
                    left: isAnimating ? 'calc(100% - 4rem - 1rem)' : '1rem',
                    transitionProperty: 'left',
                    transitionDuration: `${duration}s`,
                    transitionTimingFunction: `cubic-bezier(${p1x}, ${p1y}, ${p2x}, ${p2y})`
                  }}
                />
              </div>
              
              <div className="w-full max-w-md bg-zinc-100 dark:bg-zinc-800/50 rounded-xl p-4 relative h-24 overflow-hidden">
                <div className="text-xs text-zinc-500 mb-2">Linear Comparison</div>
                <div 
                  className="w-12 h-12 bg-zinc-400 rounded-xl absolute top-8"
                  style={{
                    left: isAnimating ? 'calc(100% - 3rem - 1rem)' : '1rem',
                    transitionProperty: 'left',
                    transitionDuration: `${duration}s`,
                    transitionTimingFunction: 'linear'
                  }}
                />
              </div>
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

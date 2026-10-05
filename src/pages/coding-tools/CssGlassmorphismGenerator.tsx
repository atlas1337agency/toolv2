import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, ArrowLeft, Check } from 'lucide-react';

export function CssGlassmorphismGenerator() {
  const [blur, setBlur] = useState(10);
  const [transparency, setTransparency] = useState(0.2);
  const [outline, setOutline] = useState(true);
  const [copied, setCopied] = useState(false);

  const getCss = () => {
    return `background: rgba(255, 255, 255, ${transparency});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: 16px;
${outline ? `border: 1px solid rgba(255, 255, 255, 0.3);` : ''}
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);`;
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
            CSS Glassmorphism Generator
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Generate CSS for applying frosted-glass effect on your HTML elements by using background blur.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Blur ({blur}px)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={blur}
                    onChange={(e) => setBlur(Number(e.target.value))}
                    className="w-full accent-zinc-900 dark:accent-zinc-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Transparency ({transparency})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={transparency}
                    onChange={(e) => setTransparency(Number(e.target.value))}
                    className="w-full accent-zinc-900 dark:accent-zinc-50"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="outline"
                    checked={outline}
                    onChange={(e) => setOutline(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:checked:bg-zinc-50"
                  />
                  <label htmlFor="outline" className="ml-2 block text-sm text-zinc-700 dark:text-zinc-300">
                    Add outline
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80 min-h-[300px] flex items-center justify-center relative overflow-hidden">
              {/* Background elements for glass effect to show */}
              <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              
              <div 
                className="relative z-10 w-64 h-40 flex items-center justify-center text-zinc-900 dark:text-zinc-50 font-medium text-lg"
                style={{
                  background: `rgba(255, 255, 255, ${transparency})`,
                  backdropFilter: `blur(${blur}px)`,
                  WebkitBackdropFilter: `blur(${blur}px)`,
                  borderRadius: '16px',
                  border: outline ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                }}
              >
                Glassmorphism
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

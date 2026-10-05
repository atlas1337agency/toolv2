import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Box, Check, ArrowLeft } from 'lucide-react';

export function RNShadowGenerator() {
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowOffsetWidth, setShadowOffsetWidth] = useState(0);
  const [shadowOffsetHeight, setShadowOffsetHeight] = useState(2);
  const [shadowOpacity, setShadowOpacity] = useState(0.25);
  const [shadowRadius, setShadowRadius] = useState(3.84);
  const [elevation, setElevation] = useState(5);
  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    return `shadowColor: "${shadowColor}",
shadowOffset: {
  width: ${shadowOffsetWidth},
  height: ${shadowOffsetHeight},
},
shadowOpacity: ${shadowOpacity},
shadowRadius: ${shadowRadius},

elevation: ${elevation},`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCode());
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
            React Native Shadow Generator
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Generate fancy box shadows in React Native both for iOS and Android.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">iOS Shadow Properties</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Shadow Color ({shadowColor})
                  </label>
                  <input
                    type="color"
                    value={shadowColor}
                    onChange={(e) => setShadowColor(e.target.value)}
                    className="h-10 w-full cursor-pointer rounded-xl border border-zinc-200 bg-white p-1 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Shadow Offset Width ({shadowOffsetWidth})
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={shadowOffsetWidth}
                    onChange={(e) => setShadowOffsetWidth(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Shadow Offset Height ({shadowOffsetHeight})
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={shadowOffsetHeight}
                    onChange={(e) => setShadowOffsetHeight(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Shadow Opacity ({shadowOpacity})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={shadowOpacity}
                    onChange={(e) => setShadowOpacity(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Shadow Radius ({shadowRadius})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="0.1"
                    value={shadowRadius}
                    onChange={(e) => setShadowRadius(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Android Shadow Properties</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Elevation ({elevation})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={elevation}
                    onChange={(e) => setElevation(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview & Code */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex-1 rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80 flex flex-col items-center justify-center min-h-[300px]">
              <div 
                className="h-48 w-48 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center"
                style={{
                  boxShadow: `${shadowOffsetWidth}px ${shadowOffsetHeight}px ${shadowRadius}px rgba(${parseInt(shadowColor.slice(1, 3), 16)}, ${parseInt(shadowColor.slice(3, 5), 16)}, ${parseInt(shadowColor.slice(5, 7), 16)}, ${shadowOpacity})`
                }}
              >
                <Box className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
              </div>
              <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-400 text-center">
                Preview (Web approximation)
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Generated Code</h3>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-900 hover:bg-zinc-200 dark:bg-[#1e2330] dark:text-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="w-full overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-mono text-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50">
                {generateCode()}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

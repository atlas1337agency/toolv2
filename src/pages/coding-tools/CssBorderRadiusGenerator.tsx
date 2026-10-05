import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, ArrowLeft, Check } from 'lucide-react';

export function CssBorderRadiusGenerator() {
  const [tl, setTl] = useState(20);
  const [tr, setTr] = useState(20);
  const [br, setBr] = useState(20);
  const [bl, setBl] = useState(20);
  const [copied, setCopied] = useState(false);

  const getCss = () => {
    if (tl === tr && tr === br && br === bl) {
      return `border-radius: ${tl}px;`;
    }
    return `border-radius: ${tl}px ${tr}px ${br}px ${bl}px;`;
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
            CSS Border Radius Generator
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Generate advanced CSS border radius to shape your HTML elements corners individually.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Top Left ({tl}px)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={tl}
                    onChange={(e) => setTl(Number(e.target.value))}
                    className="w-full accent-zinc-900 dark:accent-zinc-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Top Right ({tr}px)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={tr}
                    onChange={(e) => setTr(Number(e.target.value))}
                    className="w-full accent-zinc-900 dark:accent-zinc-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Bottom Right ({br}px)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={br}
                    onChange={(e) => setBr(Number(e.target.value))}
                    className="w-full accent-zinc-900 dark:accent-zinc-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Bottom Left ({bl}px)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={bl}
                    onChange={(e) => setBl(Number(e.target.value))}
                    className="w-full accent-zinc-900 dark:accent-zinc-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80 min-h-[300px] flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNlN2U3ZTciPjwvcmVjdD4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNlN2U3ZTciPjwvcmVjdD4KPC9zdmc+')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzE2MWIyMiI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMxZTIzMzAiPjwvcmVjdD4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMxZTIzMzAiPjwvcmVjdD4KPC9zdmc+')]">
              <div 
                className="w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-600 transition-all duration-300"
                style={{
                  borderRadius: `${tl}px ${tr}px ${br}px ${bl}px`
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

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, ArrowLeft, Check } from 'lucide-react';

export function CssTriangleGenerator() {
  const [direction, setDirection] = useState('top');
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [color, setColor] = useState('#3b82f6');
  const [copied, setCopied] = useState(false);

  const getCss = () => {
    let borders = '';
    
    switch (direction) {
      case 'top':
        borders = `border-left: ${width / 2}px solid transparent;
border-right: ${width / 2}px solid transparent;
border-bottom: ${height}px solid ${color};`;
        break;
      case 'bottom':
        borders = `border-left: ${width / 2}px solid transparent;
border-right: ${width / 2}px solid transparent;
border-top: ${height}px solid ${color};`;
        break;
      case 'left':
        borders = `border-top: ${height / 2}px solid transparent;
border-bottom: ${height / 2}px solid transparent;
border-right: ${width}px solid ${color};`;
        break;
      case 'right':
        borders = `border-top: ${height / 2}px solid transparent;
border-bottom: ${height / 2}px solid transparent;
border-left: ${width}px solid ${color};`;
        break;
      case 'top-left':
        borders = `border-top: ${height}px solid ${color};
border-right: ${width}px solid transparent;`;
        break;
      case 'top-right':
        borders = `border-top: ${height}px solid ${color};
border-left: ${width}px solid transparent;`;
        break;
      case 'bottom-left':
        borders = `border-bottom: ${height}px solid ${color};
border-right: ${width}px solid transparent;`;
        break;
      case 'bottom-right':
        borders = `border-bottom: ${height}px solid ${color};
border-left: ${width}px solid transparent;`;
        break;
    }

    return `.triangle {
  width: 0;
  height: 0;
  ${borders}
}`;
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
            CSS Triangle Generator
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Generate CSS code for triangular shapes with desired width, height, angle and color.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                    Direction
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['top-left', 'top', 'top-right', 'left', '', 'right', 'bottom-left', 'bottom', 'bottom-right'].map((dir, i) => (
                      dir ? (
                        <button
                          key={dir}
                          onClick={() => setDirection(dir)}
                          className={`px-2 py-2 text-xs font-medium rounded-lg capitalize transition-colors ${
                            direction === dir
                              ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-[#111827] dark:text-zinc-300 dark:hover:bg-zinc-800'
                          }`}
                        >
                          {dir.replace('-', ' ')}
                        </button>
                      ) : <div key={i} />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Width ({width}px)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full accent-zinc-900 dark:accent-zinc-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Height ({height}px)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full accent-zinc-900 dark:accent-zinc-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Color ({color})
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
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80 min-h-[300px] flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNlN2U3ZTciPjwvcmVjdD4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNlN2U3ZTciPjwvcmVjdD4KPC9zdmc+')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzE2MWIyMiI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMxZTIzMzAiPjwvcmVjdD4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMxZTIzMzAiPjwvcmVjdD4KPC9zdmc+')]">
              <style>{getCss()}</style>
              <div className="triangle" />
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

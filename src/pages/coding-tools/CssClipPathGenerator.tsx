import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, ArrowLeft, Check } from 'lucide-react';

export function CssClipPathGenerator() {
  const [shape, setShape] = useState('circle');
  const [copied, setCopied] = useState(false);

  const getClipPath = () => {
    switch (shape) {
      case 'circle': return 'circle(50% at 50% 50%)';
      case 'ellipse': return 'ellipse(40% 50% at 50% 50%)';
      case 'triangle': return 'polygon(50% 0%, 0% 100%, 100% 100%)';
      case 'rhombus': return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
      case 'pentagon': return 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)';
      case 'hexagon': return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
      case 'heptagon': return 'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)';
      case 'octagon': return 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';
      case 'star': return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      case 'cross': return 'polygon(10% 25%, 35% 25%, 35% 0%, 65% 0%, 65% 25%, 90% 25%, 90% 50%, 65% 50%, 65% 100%, 35% 100%, 35% 50%, 10% 50%)';
      case 'message': return 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)';
      case 'close': return 'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)';
      default: return 'circle(50% at 50% 50%)';
    }
  };

  const getCss = () => {
    return `.clip-shape {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #f43f5e, #8b5cf6);
  clip-path: ${getClipPath()};
}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`clip-path: ${getClipPath()};`);
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
            CSS Clip Path Generator
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Generate CSS clip path with different patterns and use clip-path property in your projects.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                    Shape
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['circle', 'ellipse', 'triangle', 'rhombus', 'pentagon', 'hexagon', 'heptagon', 'octagon', 'star', 'cross', 'message', 'close'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setShape(s)}
                        className={`px-3 py-2 text-xs font-medium rounded-lg capitalize transition-colors ${
                          shape === s
                            ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-[#111827] dark:text-zinc-300 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80 min-h-[300px] flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNlN2U3ZTciPjwvcmVjdD4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNlN2U3ZTciPjwvcmVjdD4KPC9zdmc+')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzE2MWIyMiI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMxZTIzMzAiPjwvcmVjdD4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMxZTIzMzAiPjwvcmVjdD4KPC9zdmc+')]">
              <div 
                style={{ 
                  width: '200px', 
                  height: '200px', 
                  background: 'linear-gradient(45deg, #f43f5e, #8b5cf6)',
                  clipPath: getClipPath(),
                  transition: 'clip-path 0.3s ease'
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
                  {copied ? 'Copied!' : 'Copy Property'}
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

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, ArrowLeft, Check } from 'lucide-react';

export function CssBackgroundPatternGenerator() {
  const [pattern, setPattern] = useState('dots');
  const [color1, setColor1] = useState('#e5e7eb');
  const [color2, setColor2] = useState('#ffffff');
  const [size, setSize] = useState(20);
  const [copied, setCopied] = useState(false);

  const getCss = () => {
    switch (pattern) {
      case 'dots':
        return `background-color: ${color2};
background-image: radial-gradient(${color1} 2px, transparent 2px);
background-size: ${size}px ${size}px;`;
      case 'stripes':
        return `background-color: ${color2};
background-image: linear-gradient(45deg, ${color1} 25%, transparent 25%, transparent 50%, ${color1} 50%, ${color1} 75%, transparent 75%, transparent);
background-size: ${size}px ${size}px;`;
      case 'grid':
        return `background-color: ${color2};
background-image: linear-gradient(${color1} 1px, transparent 1px), linear-gradient(90deg, ${color1} 1px, transparent 1px);
background-size: ${size}px ${size}px;`;
      case 'checkerboard':
        return `background-color: ${color2};
background-image: linear-gradient(45deg, ${color1} 25%, transparent 25%, transparent 75%, ${color1} 75%, ${color1}), linear-gradient(45deg, ${color1} 25%, transparent 25%, transparent 75%, ${color1} 75%, ${color1});
background-size: ${size}px ${size}px;
background-position: 0 0, ${size / 2}px ${size / 2}px;`;
      case 'zigzag':
        return `background-color: ${color2};
background-image: linear-gradient(135deg, ${color1} 25%, transparent 25%), linear-gradient(225deg, ${color1} 25%, transparent 25%), linear-gradient(45deg, ${color1} 25%, transparent 25%), linear-gradient(315deg, ${color1} 25%, ${color2} 25%);
background-position: ${size / 2}px 0, ${size / 2}px 0, 0 0, 0 0;
background-size: ${size}px ${size}px;
background-repeat: repeat;`;
      default:
        return '';
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
            CSS Background Pattern Generator
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Generate beautiful CSS-only background patterns and use it in your projects right away.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Pattern Type
                  </label>
                  <select
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                  >
                    <option value="dots">Dots</option>
                    <option value="stripes">Stripes</option>
                    <option value="grid">Grid</option>
                    <option value="checkerboard">Checkerboard</option>
                    <option value="zigzag">Zigzag</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Pattern Color ({color1})
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
                    Background Color ({color2})
                  </label>
                  <input
                    type="color"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    className="h-10 w-full cursor-pointer rounded-xl border border-zinc-200 bg-white p-1 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Size ({size}px)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full accent-zinc-900 dark:accent-zinc-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80 min-h-[300px] flex items-center justify-center overflow-hidden">
              <div 
                className="w-full h-full min-h-[300px] rounded-xl"
                style={{
                  backgroundColor: color2,
                  backgroundImage: pattern === 'dots' ? `radial-gradient(${color1} 2px, transparent 2px)` :
                                  pattern === 'stripes' ? `linear-gradient(45deg, ${color1} 25%, transparent 25%, transparent 50%, ${color1} 50%, ${color1} 75%, transparent 75%, transparent)` :
                                  pattern === 'grid' ? `linear-gradient(${color1} 1px, transparent 1px), linear-gradient(90deg, ${color1} 1px, transparent 1px)` :
                                  pattern === 'checkerboard' ? `linear-gradient(45deg, ${color1} 25%, transparent 25%, transparent 75%, ${color1} 75%, ${color1}), linear-gradient(45deg, ${color1} 25%, transparent 25%, transparent 75%, ${color1} 75%, ${color1})` :
                                  pattern === 'zigzag' ? `linear-gradient(135deg, ${color1} 25%, transparent 25%), linear-gradient(225deg, ${color1} 25%, transparent 25%), linear-gradient(45deg, ${color1} 25%, transparent 25%), linear-gradient(315deg, ${color1} 25%, ${color2} 25%)` : '',
                  backgroundSize: `${size}px ${size}px`,
                  backgroundPosition: pattern === 'checkerboard' ? `0 0, ${size / 2}px ${size / 2}px` : 
                                      pattern === 'zigzag' ? `${size / 2}px 0, ${size / 2}px 0, 0 0, 0 0` : '0 0',
                  backgroundRepeat: 'repeat'
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

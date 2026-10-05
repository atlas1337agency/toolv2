import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, ArrowLeft, Check } from 'lucide-react';

export function CssSwitchGenerator() {
  const [color, setColor] = useState('#3b82f6');
  const [size, setSize] = useState(60);
  const [copied, setCopied] = useState(false);

  const getCss = () => {
    const height = size / 2;
    const sliderSize = height - 8;
    
    return `.switch {
  position: relative;
  display: inline-block;
  width: ${size}px;
  height: ${height}px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: ${height}px;
}

.slider:before {
  position: absolute;
  content: "";
  height: ${sliderSize}px;
  width: ${sliderSize}px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: ${color};
}

input:focus + .slider {
  box-shadow: 0 0 1px ${color};
}

input:checked + .slider:before {
  transform: translateX(${size - sliderSize - 8}px);
}`;
  };

  const getHtml = () => {
    return `<label class="switch">
  <input type="checkbox" checked>
  <span class="slider"></span>
</label>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCss() + '\n\n' + getHtml());
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
            CSS Switch Generator
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Generate beautiful CSS switches and toggles without Javascript.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80">
              <div className="space-y-4">
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

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Width ({size}px)
                  </label>
                  <input
                    type="range"
                    min="30"
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
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80 min-h-[200px] flex items-center justify-center">
              <style>{getCss()}</style>
              <div dangerouslySetInnerHTML={{ __html: getHtml() }} />
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
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">CSS</p>
                  <pre className="overflow-x-auto rounded-xl bg-zinc-950 p-4 text-sm text-zinc-50 dark:bg-zinc-900">
                    <code>{getCss()}</code>
                  </pre>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">HTML</p>
                  <pre className="overflow-x-auto rounded-xl bg-zinc-950 p-4 text-sm text-zinc-50 dark:bg-zinc-900">
                    <code>{getHtml()}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, ArrowLeft, Check } from 'lucide-react';

export function CssCheckboxGenerator() {
  const [color, setColor] = useState('#3b82f6');
  const [size, setSize] = useState(24);
  const [style, setStyle] = useState('rounded');
  const [copied, setCopied] = useState(false);

  const getCss = () => {
    const borderRadius = style === 'rounded' ? '4px' : style === 'circular' ? '50%' : '0px';
    
    return `.custom-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  font-family: system-ui, sans-serif;
  color: #333;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  display: inline-block;
  width: ${size}px;
  height: ${size}px;
  background-color: #eee;
  border-radius: ${borderRadius};
  transition: background-color 0.2s, transform 0.2s;
  margin-right: 8px;
}

.custom-checkbox:hover input ~ .checkmark {
  background-color: #ccc;
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: ${color};
  animation: pop 0.3s ease;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: ${size * 0.35}px;
  top: ${size * 0.15}px;
  width: ${size * 0.25}px;
  height: ${size * 0.5}px;
  border: solid white;
  border-width: 0 ${Math.max(2, size / 12)}px ${Math.max(2, size / 12)}px 0;
  transform: rotate(45deg);
}

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
}

@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(0.9); }
  100% { transform: scale(1); }
}`;
  };

  const getHtml = () => {
    return `<label class="custom-checkbox">
  <input type="checkbox" checked>
  <span class="checkmark"></span>
  Checkbox Label
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
            CSS Checkbox Generator
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Generate CSS checkboxes with different styles by customizing color and size.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Style
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                  >
                    <option value="rounded">Rounded</option>
                    <option value="square">Square</option>
                    <option value="circular">Circular</option>
                  </select>
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

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Size ({size}px)
                  </label>
                  <input
                    type="range"
                    min="16"
                    max="64"
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

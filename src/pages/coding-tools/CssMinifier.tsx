import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Download, Paintbrush, Check } from 'lucide-react';

export function CssMinifier() {
  const [input, setInput] = useState('/* Example CSS */\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.box {\n  width: 100px;\n  height: 100px;\n  background-color: red;\n}');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const minifyCss = () => {
    let minified = input;
    // Remove comments
    minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove whitespace
    minified = minified.replace(/\s+/g, ' ');
    // Remove spaces around characters
    minified = minified.replace(/\s*([\{\}\:\;\,])\s*/g, '$1');
    // Remove trailing semicolons
    minified = minified.replace(/;\}/g, '}');
    
    setOutput(minified.trim());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'style.min.css';
    a.click();
    URL.revokeObjectURL(url);
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
            CSS Minifier
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Minify your CSS code and copy the minified code to your clipboard or download as style.min.css file.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Input CSS
              </label>
              <button
                onClick={minifyCss}
                className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
              >
                <Paintbrush className="h-4 w-4" /> Minify
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-[500px] w-full resize-none rounded-2xl border border-zinc-200 bg-white p-4 text-sm font-mono focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#1f2937] dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50 shadow-sm"
              placeholder="Paste your CSS code here..."
            />
          </div>

          {/* Output */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Minified Output
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!output}
                  className="flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 disabled:opacity-50 dark:bg-[#1e2330] dark:text-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!output}
                  className="flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 disabled:opacity-50 dark:bg-[#1e2330] dark:text-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
              </div>
            </div>
            <textarea
              value={output}
              readOnly
              className="h-[500px] w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-mono focus:outline-none dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50 shadow-sm"
              placeholder="Minified CSS will appear here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

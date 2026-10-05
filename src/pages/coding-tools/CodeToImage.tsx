import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Download, Copy, Code2, Settings, ArrowLeft } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import html2canvas from 'html2canvas';

const languages = [
  'javascript', 'typescript', 'html', 'css', 'python', 'java', 'cpp', 'csharp', 'php', 'ruby', 'go', 'rust', 'sql', 'json', 'bash'
];

const themes = [
  { name: 'Dark', style: vscDarkPlus, bg: 'bg-zinc-900' },
  { name: 'Light', style: undefined, bg: 'bg-white' },
];

const gradients = [
  'bg-gradient-to-br from-purple-500 to-pink-500',
  'bg-gradient-to-br from-cyan-500 to-blue-500',
  'bg-gradient-to-br from-emerald-500 to-teal-500',
  'bg-gradient-to-br from-orange-500 to-red-500',
  'bg-gradient-to-br from-zinc-800 to-zinc-900',
];

export function CodeToImage() {
  const [code, setCode] = useState('function helloWorld() {\n  console.log("Hello, World!");\n}');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState(themes[0]);
  const [bgGradient, setBgGradient] = useState(gradients[0]);
  const [padding, setPadding] = useState(32);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [title, setTitle] = useState('hello.js');
  
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!previewRef.current) return;
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: null,
      });
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'code-snippet.png';
      a.click();
    } catch (error) {
      console.error('Failed to generate image', error);
    }
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
            Code to Image
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Convert your code snippets into beautiful, shareable images.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                <Settings className="h-5 w-5" /> Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Background</label>
                  <div className="flex flex-wrap gap-2">
                    {gradients.map((grad, i) => (
                      <button
                        key={i}
                        onClick={() => setBgGradient(grad)}
                        className={`h-8 w-8 rounded-full ${grad} ${bgGradient === grad ? 'ring-2 ring-zinc-900 dark:ring-zinc-50 ring-offset-2 dark:ring-offset-[#161b22]' : ''}`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Padding ({padding}px)</label>
                  <input
                    type="range"
                    min="16"
                    max="64"
                    value={padding}
                    onChange={(e) => setPadding(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">File Name</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="lineNumbers"
                    checked={showLineNumbers}
                    onChange={(e) => setShowLineNumbers(e.target.checked)}
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:checked:bg-zinc-50 dark:focus:ring-zinc-50"
                  />
                  <label htmlFor="lineNumbers" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Show Line Numbers
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Code Input</h3>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-64 w-full resize-none rounded-xl border border-zinc-200 bg-white p-3 text-sm font-mono focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                placeholder="Paste your code here..."
              />
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex justify-end">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
              >
                <Download className="h-4 w-4" /> Download Image
              </button>
            </div>
            
            <div className="overflow-auto rounded-2xl border border-zinc-200/60 bg-zinc-100/50 p-4 dark:border-[#374151]/60 dark:bg-[#111827]/50 flex items-center justify-center min-h-[400px]">
              <div 
                ref={previewRef}
                className={`transition-all ${bgGradient} rounded-xl shadow-2xl`}
                style={{ padding: `${padding}px` }}
              >
                <div className={`overflow-hidden rounded-lg shadow-2xl ${theme.bg}`}>
                  <div className="flex items-center gap-2 px-4 py-3 bg-black/10 dark:bg-white/5">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    {title && (
                      <div className="mx-auto text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {title}
                      </div>
                    )}
                  </div>
                  <div className="p-4 overflow-hidden">
                    <SyntaxHighlighter
                      language={language}
                      style={theme.style}
                      showLineNumbers={showLineNumbers}
                      customStyle={{
                        margin: 0,
                        padding: 0,
                        background: 'transparent',
                        fontSize: '14px',
                      }}
                    >
                      {code}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Link as LinkIcon, RefreshCw, Check, ArrowLeft } from 'lucide-react';
import slugify from 'slugify';

export function SlugGenerator() {
  const [input, setInput] = useState('Generate SEO-friendly slugs from titles or any other strings for your webpages or blog posts.');
  const [slug, setSlug] = useState('');
  const [separator, setSeparator] = useState('-');
  const [lowercase, setLowercase] = useState(true);
  const [strict, setStrict] = useState(true);
  const [trim, setTrim] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generatedSlug = slugify(input, {
      replacement: separator,
      lower: lowercase,
      strict: strict,
      trim: trim,
    });
    setSlug(generatedSlug);
  }, [input, separator, lowercase, strict, trim]);

  const handleCopy = () => {
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-[#111827]/50">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <Link
            to="/coding-tools"
            className="mb-4 inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Coding Tools
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            URL Slug Generator
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Generate SEO-friendly slugs from titles or any other strings for your webpages or blog posts.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Input String
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="h-32 w-full resize-none rounded-xl border border-zinc-200 bg-white p-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                placeholder="Enter your title here..."
              />
            </div>

            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Generated Slug
                </label>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-900 hover:bg-zinc-200 dark:bg-[#1e2330] dark:text-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-mono text-zinc-900 break-all dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50">
                {slug || 'your-slug-will-appear-here'}
              </div>
            </div>
          </div>

          <div className="md:col-span-4 space-y-6">
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Options</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Separator</label>
                  <select
                    value={separator}
                    onChange={(e) => setSeparator(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                  >
                    <option value="-">Hyphen (-)</option>
                    <option value="_">Underscore (_)</option>
                    <option value="">None</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Lowercase</label>
                  <input
                    type="checkbox"
                    checked={lowercase}
                    onChange={(e) => setLowercase(e.target.checked)}
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:checked:bg-zinc-50 dark:focus:ring-zinc-50"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Strict (Remove special chars)</label>
                  <input
                    type="checkbox"
                    checked={strict}
                    onChange={(e) => setStrict(e.target.checked)}
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:checked:bg-zinc-50 dark:focus:ring-zinc-50"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Trim whitespace</label>
                  <input
                    type="checkbox"
                    checked={trim}
                    onChange={(e) => setTrim(e.target.checked)}
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:checked:bg-zinc-50 dark:focus:ring-zinc-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

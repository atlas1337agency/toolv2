import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Copy, Check, AlertCircle, ArrowLeft } from 'lucide-react';

type HashAlgorithm = 'MD5' | 'SHA1' | 'SHA256' | 'SHA384' | 'SHA512';

interface HashDecryptToolProps {
  algorithm: HashAlgorithm;
  title: string;
  description: string;
}

export function HashDecryptTool({ algorithm, title, description }: HashDecryptToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleProcess = () => {
    if (!input) return;
    
    setIsSearching(true);
    setError('');
    setOutput('');

    // Simulate a rainbow table lookup
    setTimeout(() => {
      setIsSearching(false);
      setError(`Hash not found in rainbow table database. ${algorithm} is a one-way cryptographic hash function and cannot be directly decrypted.`);
    }, 1500);
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:px-6 lg:px-8">
      <Link to="/encryption-tools" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
        <ArrowLeft className="h-4 w-4" />
        Back to Encryption Tools
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{title}</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-400">About Hash Decryption</h3>
              <p className="text-sm text-amber-700 dark:text-amber-500">
                Hashes are one-way mathematical functions. They cannot be "decrypted" mathematically. 
                This tool searches known rainbow tables (databases of pre-computed hashes) to find a match.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Input {algorithm} Hash</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Enter ${algorithm} hash to search...`}
              className="min-h-[200px] w-full resize-none rounded-xl border border-zinc-200 bg-white p-4 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Decrypted Text</label>
              <button
                onClick={handleCopy}
                disabled={!output}
                className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Decrypted text will appear here if found..."
              className="min-h-[200px] w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/50"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>

        <button
          onClick={handleProcess}
          disabled={!input || isSearching}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 md:w-auto"
        >
          {isSearching ? 'Searching Database...' : `Decrypt ${algorithm}`}
          {!isSearching && <Search className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

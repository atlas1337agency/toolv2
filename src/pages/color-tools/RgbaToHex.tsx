import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import chroma from 'chroma-js';

export function RgbaToHex() {
  const [rgba, setRgba] = useState('rgba(59, 130, 246, 1)');
  const [hex, setHex] = useState('');
  const [hex8, setHex8] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      if (chroma.valid(rgba)) {
        const color = chroma(rgba);
        setHex(color.hex('rgb'));
        setHex8(color.hex('rgba'));
        setError('');
      } else {
        setError('Invalid RGBA color code');
        setHex('');
        setHex8('');
      }
    } catch (err) {
      setError('Invalid RGBA color code');
      setHex('');
      setHex8('');
    }
  }, [rgba]);

  const handleCopy = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:px-6 lg:px-8">
      <Link to="/color-tools" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
        <ArrowLeft className="h-4 w-4" />
        Back to Color Tools
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">RGBA to HEX Converter</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Convert RGBA color codes to alpha supported 6 or 8 digit HEX equivalents.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">RGBA Color Code</label>
            <input
              type="text"
              value={rgba}
              onChange={(e) => setRgba(e.target.value)}
              placeholder="rgba(255, 87, 51, 0.5) or rgb(255, 87, 51)"
              className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">6-Digit HEX (No Alpha)</label>
              <button
                onClick={() => handleCopy(hex)}
                disabled={!hex}
                className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <input
              type="text"
              value={hex}
              readOnly
              className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/50"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">8-Digit HEX (With Alpha)</label>
              <button
                onClick={() => handleCopy(hex8)}
                disabled={!hex8}
                className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <input
              type="text"
              value={hex8}
              readOnly
              className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/50"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <div 
            className="mb-6 h-48 w-full max-w-xs rounded-2xl shadow-inner border border-zinc-200 dark:border-zinc-800"
            style={{ backgroundColor: chroma.valid(rgba) ? rgba : 'transparent' }}
          />
          <p className="text-lg font-mono font-semibold text-zinc-900 dark:text-zinc-50">
            {chroma.valid(rgba) ? rgba : '---'}
          </p>
        </div>
      </div>
    </div>
  );
}

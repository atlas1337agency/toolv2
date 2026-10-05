import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import chroma from 'chroma-js';

export function HexToRgba() {
  const [hex, setHex] = useState('#3b82f6');
  const [rgba, setRgba] = useState('');
  const [details, setDetails] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      if (chroma.valid(hex)) {
        const color = chroma(hex);
        const [r, g, b, a] = color.rgba();
        setRgba(`rgba(${r}, ${g}, ${b}, ${a})`);
        setDetails({
          hsl: color.css('hsl'),
          hsv: `hsv(${Math.round(color.hsv()[0] || 0)}, ${Math.round(color.hsv()[1] * 100)}%, ${Math.round(color.hsv()[2] * 100)}%)`,
          cmyk: `cmyk(${color.cmyk().map(v => Math.round(v * 100)).join('%, ')}%)`,
          luminance: color.luminance().toFixed(3),
          contrastWhite: chroma.contrast(color, 'white').toFixed(2),
          contrastBlack: chroma.contrast(color, 'black').toFixed(2),
        });
        setError('');
      } else {
        setError('Invalid HEX color code');
        setRgba('');
        setDetails(null);
      }
    } catch (err) {
      setError('Invalid HEX color code');
      setRgba('');
      setDetails(null);
    }
  }, [hex]);

  const handleCopy = () => {
    if (rgba) {
      navigator.clipboard.writeText(rgba);
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
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">HEX to RGBA Converter</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Convert HEX color codes to RGBA equivalents and see all details of a color.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">HEX Color Code</label>
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              placeholder="#FF5733 or #FF573380"
              className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">RGBA Output</label>
              <button
                onClick={handleCopy}
                disabled={!rgba}
                className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <input
              type="text"
              value={rgba}
              readOnly
              className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/50"
            />
          </div>

          {details && (
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <h3 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-50">Color Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-zinc-500 dark:text-zinc-400">HSL</p>
                  <p className="font-mono font-medium text-zinc-900 dark:text-zinc-50">{details.hsl}</p>
                </div>
                <div>
                  <p className="text-zinc-500 dark:text-zinc-400">HSV</p>
                  <p className="font-mono font-medium text-zinc-900 dark:text-zinc-50">{details.hsv}</p>
                </div>
                <div>
                  <p className="text-zinc-500 dark:text-zinc-400">CMYK</p>
                  <p className="font-mono font-medium text-zinc-900 dark:text-zinc-50">{details.cmyk}</p>
                </div>
                <div>
                  <p className="text-zinc-500 dark:text-zinc-400">Luminance</p>
                  <p className="font-mono font-medium text-zinc-900 dark:text-zinc-50">{details.luminance}</p>
                </div>
                <div>
                  <p className="text-zinc-500 dark:text-zinc-400">Contrast (White)</p>
                  <p className="font-mono font-medium text-zinc-900 dark:text-zinc-50">{details.contrastWhite}:1</p>
                </div>
                <div>
                  <p className="text-zinc-500 dark:text-zinc-400">Contrast (Black)</p>
                  <p className="font-mono font-medium text-zinc-900 dark:text-zinc-50">{details.contrastBlack}:1</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <div 
            className="mb-6 h-48 w-full max-w-xs rounded-2xl shadow-inner border border-zinc-200 dark:border-zinc-800"
            style={{ backgroundColor: chroma.valid(hex) ? hex : 'transparent' }}
          />
          <p className="text-lg font-mono font-semibold text-zinc-900 dark:text-zinc-50">
            {chroma.valid(hex) ? hex.toUpperCase() : '---'}
          </p>
        </div>
      </div>
    </div>
  );
}

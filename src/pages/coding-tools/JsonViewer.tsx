import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Download, FileJson, Check, ChevronRight, ChevronDown } from 'lucide-react';

const JsonNode = ({ keyName, value, isLast }: { keyName: string | null, value: any, isLast: boolean }) => {
  const [expanded, setExpanded] = useState(true);

  if (typeof value === 'object' && value !== null) {
    const isArray = Array.isArray(value);
    const keys = Object.keys(value);
    const isEmpty = keys.length === 0;

    return (
      <div className="ml-4 font-mono text-sm">
        <div 
          className="flex items-center cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded px-1 -ml-1"
          onClick={() => setExpanded(!expanded)}
        >
          {!isEmpty && (
            <span className="w-4 h-4 inline-flex items-center justify-center mr-1 text-zinc-500">
              {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </span>
          )}
          {isEmpty && <span className="w-4 h-4 inline-block mr-1"></span>}
          {keyName && <span className="text-purple-600 dark:text-purple-400">"{keyName}"</span>}
          {keyName && <span className="text-zinc-500 dark:text-zinc-400 mx-1">:</span>}
          <span className="text-zinc-500 dark:text-zinc-400">{isArray ? '[' : '{'}</span>
          {!expanded && !isEmpty && <span className="text-zinc-500 dark:text-zinc-400 mx-1">...</span>}
          {!expanded && <span className="text-zinc-500 dark:text-zinc-400">{isArray ? ']' : '}'}{!isLast && ','}</span>}
          {!expanded && <span className="text-zinc-400 dark:text-zinc-500 ml-2 text-xs italic">{keys.length} items</span>}
        </div>
        
        {expanded && !isEmpty && (
          <div>
            {keys.map((k, i) => (
              <JsonNode 
                key={k} 
                keyName={isArray ? null : k} 
                value={value[k as keyof typeof value]} 
                isLast={i === keys.length - 1} 
              />
            ))}
            <div className="ml-5 text-zinc-500 dark:text-zinc-400">
              {isArray ? ']' : '}'}{!isLast && ','}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Primitive values
  let valueColor = 'text-blue-600 dark:text-blue-400'; // string
  if (typeof value === 'number') valueColor = 'text-orange-600 dark:text-orange-400';
  if (typeof value === 'boolean') valueColor = 'text-pink-600 dark:text-pink-400';
  if (value === null) valueColor = 'text-zinc-500 dark:text-zinc-400';

  const displayValue = typeof value === 'string' ? `"${value}"` : String(value);

  return (
    <div className="ml-9 font-mono text-sm flex items-start">
      {keyName && <span className="text-purple-600 dark:text-purple-400">"{keyName}"</span>}
      {keyName && <span className="text-zinc-500 dark:text-zinc-400 mx-1">:</span>}
      <span className={valueColor}>{displayValue}</span>
      {!isLast && <span className="text-zinc-500 dark:text-zinc-400">,</span>}
    </div>
  );
};

export function JsonViewer() {
  const [input, setInput] = useState('{\n  "name": "Nexa 1337",\n  "version": "1.0.0",\n  "features": [\n    "JSON Viewer",\n    "Formatters",\n    "Minifiers"\n  ],\n  "active": true,\n  "metadata": null\n}');
  const [parsedData, setParsedData] = useState<any>(null);
  const [error, setError] = useState('');

  const parseJson = () => {
    try {
      setError('');
      const data = JSON.parse(input);
      setParsedData(data);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON');
      setParsedData(null);
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
            JSON Tree Viewer
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            View your JSON data in tree view, walk through all branches and update nodes if you need to.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Input JSON
              </label>
              <button
                onClick={parseJson}
                className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
              >
                <FileJson className="h-4 w-4" /> View Tree
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-[500px] w-full resize-none rounded-2xl border border-zinc-200 bg-white p-4 text-sm font-mono focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#1f2937] dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50 shadow-sm"
              placeholder="Paste your JSON here..."
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          {/* Output */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Tree View
              </label>
            </div>
            <div className="h-[500px] w-full overflow-auto rounded-2xl border border-zinc-200 bg-white p-4 dark:border-[#374151] dark:bg-[#1f2937] shadow-sm">
              {parsedData ? (
                <div className="-ml-4">
                  <JsonNode keyName={null} value={parsedData} isLast={true} />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
                  Click "View Tree" to parse JSON
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

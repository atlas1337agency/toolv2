import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, MousePointerClick } from 'lucide-react';

interface NexaPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const links = [
  { name: "N E X A 1337", url: "https://nexa1337.github.io/nexa1337", clicks: "112.4k" },
  { name: "N E X A 1337 - SecretArea", url: "https://nexa1337.github.io/secretarea", clicks: "84.2k" },
  { name: "N E X A 1337 - Tool v1", url: "https://nexa1337.github.io/tool", clicks: "105.1k" },
  { name: "N E X A 1337 - Tool v2", url: "https://nexa1337.github.io/toolv2", clicks: "92.8k" },
  { name: "N E X A 1337 - Digital Store", url: "https://digitalstore-iota-five.vercel.app/", clicks: "45.6k" },
  { name: "N E X A 1337 - school", url: "https://school-lime-psi.vercel.app/", clicks: "76.4k" },
];

export function NexaPopup({ isOpen, onClose }: NexaPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div className="overflow-hidden rounded-2xl border border-zinc-200/50 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-[#374151]/50 dark:bg-[#1f2937]/90">
              <div className="flex items-center justify-between border-b border-zinc-200/50 p-4 dark:border-[#374151]/50">
                <h2 className="text-lg font-bold tracking-widest text-zinc-900 dark:text-zinc-50">
                  N E X A 1337
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-[#374151]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                {links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-xl border border-zinc-200/50 bg-zinc-50/50 p-3 transition-all hover:bg-zinc-100 dark:border-[#374151]/50 dark:bg-[#1e2330]/50 dark:hover:bg-[#252b3b]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-200/50 text-zinc-600 dark:bg-[#252b3b]/50 dark:text-zinc-400">
                        <ExternalLink className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {link.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      <MousePointerClick className="h-3.5 w-3.5" />
                      {link.clicks}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

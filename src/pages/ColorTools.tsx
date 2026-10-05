import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, Droplet, Hash, Layers, Blend } from 'lucide-react';
import { motion } from 'motion/react';

const tools = [
  {
    title: 'AI Color Palette Generator',
    description: 'Craft perfect color palettes effortlessly with AI-driven creativity.',
    icon: Palette,
    href: '/color-tools/ai-palette',
    color: 'bg-indigo-500/10 text-indigo-500',
  },
  {
    title: 'HEX to RGBA Converter',
    description: 'Convert HEX color codes to RGBA equivalents and see all details of a color.',
    icon: Hash,
    href: '/color-tools/hex-to-rgba',
    color: 'bg-emerald-500/10 text-emerald-500',
  },
  {
    title: 'RGBA to HEX Converter',
    description: 'Convert RGBA color codes to alpha supported 6 or 8 digit HEX equivalents.',
    icon: Droplet,
    href: '/color-tools/rgba-to-hex',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    title: 'Color Shades Generator',
    description: 'Get all shades of a color by setting up steps for darken, lighten, saturation and desaturation.',
    icon: Layers,
    href: '/color-tools/shades',
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    title: 'Color Mixer',
    description: 'Mix 2 colors and get color codes for intermediate colors from 2 to 10 steps.',
    icon: Blend,
    href: '/color-tools/mixer',
    color: 'bg-rose-500/10 text-rose-500',
  },
];

export function ColorTools() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Color Tools</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          A collection of smart tools for working with colors, palettes, and conversions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={tool.href}
              className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tool.color}`}>
                  <tool.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{tool.title}</h3>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 flex-1">{tool.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

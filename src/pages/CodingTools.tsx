import React from "react";
import { Link } from "react-router-dom";
import { 
  Code2, 
  Link as LinkIcon, 
  Box, 
  FileCode2, 
  FileJson, 
  FileText, 
  AlignLeft, 
  Paintbrush, 
  Braces,
  Loader2,
  CheckSquare,
  ToggleLeft,
  Scissors,
  Grid,
  Activity,
  Droplet,
  Zap,
  Palette,
  Triangle,
  Square,
  Circle,
  Type
} from "lucide-react";

const tools = [
  {
    name: "Code to Image Converter",
    description: "Convert your codes to fancy images and share with your friends or colleagues.",
    icon: Code2,
    href: "/coding-tools/code-to-image",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    name: "URL Slug Generator",
    description: "Generate SEO-friendly slugs from titles or any other strings for your webpages or blog posts.",
    icon: LinkIcon,
    href: "/coding-tools/slug-generator",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    name: "React Native Shadow Generator",
    description: "Generate fancy box shadows in React Native both for iOS and Android.",
    icon: Box,
    href: "/coding-tools/rn-shadow",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    name: "HTML Minifier",
    description: "Minify your HTML code and copy the minified code to your clipboard or download as .html file.",
    icon: FileCode2,
    href: "/coding-tools/html-minifier",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    name: "CSS Minifier",
    description: "Minify your CSS code and copy the minified code to your clipboard or download as style.min.css file.",
    icon: Paintbrush,
    href: "/coding-tools/css-minifier",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    name: "JavaScript Minifier",
    description: "Minify your JavaScript code and copy the minified code to your clipboard or download as .min.js file.",
    icon: Braces,
    href: "/coding-tools/js-minifier",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    name: "HTML Formatter",
    description: "Format your HTML code with HTML beautifier and either copy the formatted HTML or download it.",
    icon: AlignLeft,
    href: "/coding-tools/html-formatter",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    name: "CSS Formatter",
    description: "Format your CSS code and copy the beautified code to your clipboard or download as style.css file.",
    icon: Paintbrush,
    href: "/coding-tools/css-formatter",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    name: "JavaScript Formatter",
    description: "Format/beautify your JavaScript code and copy the formatted code to your clipboard or download as a file.",
    icon: Braces,
    href: "/coding-tools/js-formatter",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    name: "JSON Tree Viewer",
    description: "View your JSON data in tree view, walk through all branches and update nodes if you need to.",
    icon: FileJson,
    href: "/coding-tools/json-viewer",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
];

const cssTools = [
  {
    name: "CSS Loader Generator",
    description: "Generate fancy CSS loaders by specifying the type, color and size of the loading indicator.",
    icon: Loader2,
    href: "/coding-tools/css-loader-generator",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    name: "CSS Checkbox Generator",
    description: "Generate CSS checkboxes with different styles by customizing color and size.",
    icon: CheckSquare,
    href: "/coding-tools/css-checkbox-generator",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    name: "CSS Switch Generator",
    description: "Generate beautiful CSS switches and toggles without Javascript.",
    icon: ToggleLeft,
    href: "/coding-tools/css-switch-generator",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    name: "CSS Clip Path Generator",
    description: "Generate CSS clip path with different patterns and use clip-path property in your projects.",
    icon: Scissors,
    href: "/coding-tools/css-clip-path-generator",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    name: "CSS Background Pattern Generator",
    description: "Generate beautiful CSS-only background patterns and use it in your projects right away.",
    icon: Grid,
    href: "/coding-tools/css-background-pattern-generator",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    name: "CSS Cubic Bezier Generator",
    description: "Generate CSS cubic Bezier easing functions by previewing animation and time-progress graph.",
    icon: Activity,
    href: "/coding-tools/css-cubic-bezier-generator",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    name: "CSS Glassmorphism Generator",
    description: "Generate CSS for applying frosted-glass effect on your HTML elements by using background blur.",
    icon: Droplet,
    href: "/coding-tools/css-glassmorphism-generator",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    name: "CSS Text Glitch Effect Generator",
    description: "Generate CSS text glitch effect and create fancy text animations by using pure CSS.",
    icon: Zap,
    href: "/coding-tools/css-text-glitch-generator",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    name: "CSS Gradient Generator",
    description: "Generate beautiful CSS gradients either by using presets or customizing on your own.",
    icon: Palette,
    href: "/coding-tools/css-gradient-generator",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    name: "CSS Triangle Generator",
    description: "Generate CSS code for triangular shapes with desired width, height, angle and color.",
    icon: Triangle,
    href: "/coding-tools/css-triangle-generator",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
  {
    name: "CSS Box Shadow Generator",
    description: "Generate CSS code for box shadows while previewing it for box, circle or header design.",
    icon: Square,
    href: "/coding-tools/css-box-shadow-generator",
    color: "text-fuchsia-500",
    bgColor: "bg-fuchsia-500/10",
  },
  {
    name: "CSS Border Radius Generator",
    description: "Generate advanced CSS border radius to shape your HTML elements corners individually.",
    icon: Circle,
    href: "/coding-tools/css-border-radius-generator",
    color: "text-lime-500",
    bgColor: "bg-lime-500/10",
  },
  {
    name: "CSS Text Shadow Generator",
    description: "Generate beautiful CSS text shadows to make your typography stand out.",
    icon: Type,
    href: "/coding-tools/css-text-shadow-generator",
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
  }
];

export function CodingTools() {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-[#111827]/50">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Coding Tools
            </h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              A collection of useful tools for developers to format, minify, and generate code.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.name}
                to={tool.href}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm transition-all hover:shadow-md dark:border-[#374151]/60 dark:bg-[#1f2937]/80"
              >
                <div>
                  <div className={`inline-flex rounded-xl p-3 ${tool.bgColor}`}>
                    <tool.icon className={`h-6 w-6 ${tool.color}`} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {tool.name}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {tool.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              CSS Tools Collection
            </h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              Generate beautiful CSS snippets for your next project.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cssTools.map((tool) => (
              <Link
                key={tool.name}
                to={tool.href}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm transition-all hover:shadow-md dark:border-[#374151]/60 dark:bg-[#1f2937]/80"
              >
                <div>
                  <div className={`inline-flex rounded-xl p-3 ${tool.bgColor}`}>
                    <tool.icon className={`h-6 w-6 ${tool.color}`} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {tool.name}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {tool.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

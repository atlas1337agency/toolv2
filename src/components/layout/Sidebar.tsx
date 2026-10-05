import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, QrCode, FileSpreadsheet, FileEdit, Moon, Sun, Image as ImageIcon, FileType2, Share2, Shield, Palette, ScrollText, Code2, Smartphone } from "lucide-react";
import { FaWolfPackBattalion } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "motion/react";

export const navItems = [
  { name: "Resume", href: "/resume", icon: FileText },
  { name: "QR Code", href: "/qr", icon: QrCode },
  { name: "Invoice", href: "/invoice", icon: FileSpreadsheet },
  { name: "Facture", href: "/facture", icon: FileSpreadsheet },
  { name: "Reçu", href: "/document", icon: FileEdit },
  { name: "Image Tools", href: "/image-tools", icon: ImageIcon },
  { name: "PDF Tools", href: "/pdf-tools", icon: FileType2 },
  { name: "Social Tools", href: "/social-tools", icon: Share2 },
  { name: "Encryption Tools", href: "/encryption-tools", icon: Shield },
  { name: "Color Tools", href: "/color-tools", icon: Palette },
  { name: "Coding Tools", href: "/coding-tools", icon: Code2 },
  { name: "Convert Website To App", href: "/convert-website-to-app", icon: Smartphone },
  { name: "App Builder", href: "/app-builder", icon: Smartphone },
  { name: "PaperMe", href: "/paperme", icon: ScrollText },
];

export function Sidebar({ onOpenPopup }: { onOpenPopup?: () => void }) {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <div className="hidden lg:flex h-screen w-64 flex-col border-r border-zinc-200/60 bg-white/50 backdrop-blur-xl dark:border-[#374151]/60 dark:bg-[#111827]/50">
      <div className="flex h-16 items-center gap-3 border-b border-zinc-200/60 px-6 dark:border-[#374151]/60">
        <div className="relative flex h-8 w-8 items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <FaWolfPackBattalion className="absolute h-7 w-7 text-cyan-400/70 mix-blend-screen animate-glitch" style={{ animationDelay: '-0.2s', transform: 'translate(-2px, 2px)' }} />
            <FaWolfPackBattalion className="absolute h-7 w-7 text-rose-500/70 mix-blend-screen animate-glitch" style={{ animationDelay: '-0.4s', animationDirection: 'reverse', transform: 'translate(2px, -2px)' }} />
          </div>
          <FaWolfPackBattalion className="relative z-10 h-7 w-7 text-zinc-900 dark:text-zinc-100" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-start gap-1.5">
            <span className="font-semibold tracking-tight text-lg leading-none">N E X A 1337</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[9px] font-bold uppercase tracking-wider leading-none -mt-1">Beta</span>
          </div>
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 animate-flash leading-none mt-1">MultiTool</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-6">
        <nav className="grid gap-2 px-4">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-500 hover:bg-zinc-100/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-zinc-100 dark:bg-zinc-800/60"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="relative z-10 h-4 w-4" />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto border-t border-zinc-200/60 p-4 dark:border-[#374151]/60 space-y-4">
        <button
          onClick={() => {
            const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
            setTheme(isDark ? "light" : "dark");
          }}
          className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-100/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-[#374151]/50 dark:hover:text-zinc-50 transition-colors"
        >
          <span className="flex items-center gap-3">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
          <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-zinc-200 dark:bg-[#252b3b] transition-colors">
            <span className={cn("inline-block h-3 w-3 transform rounded-full bg-white transition-transform", theme === "dark" ? "translate-x-5" : "translate-x-1")} />
          </div>
        </button>
        <div className="px-3 text-xs text-zinc-500 dark:text-zinc-400">
          &copy; 2026 <button onClick={onOpenPopup} className="font-semibold hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">N E X A 1337</button>. All rights reserved.
        </div>
      </div>
    </div>
  );
}

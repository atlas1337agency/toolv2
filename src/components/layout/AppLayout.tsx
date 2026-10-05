import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Sidebar, navItems } from "./Sidebar";
import { NexaPopup } from "./NexaPopup";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Menu, X } from "lucide-react";
import { FaWolfPackBattalion } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

function MobileHeader() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <div className="lg:hidden flex h-14 items-center justify-between border-b border-zinc-200/60 bg-white/80 backdrop-blur-xl px-4 dark:border-[#374151]/60 dark:bg-[#111827]/80 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-lg p-1.5 -ml-1.5 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-[#374151] transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <FaWolfPackBattalion className="absolute h-6 w-6 text-cyan-400/70 mix-blend-screen animate-glitch" style={{ animationDelay: '-0.2s', transform: 'translate(-2px, 2px)' }} />
                <FaWolfPackBattalion className="absolute h-6 w-6 text-rose-500/70 mix-blend-screen animate-glitch" style={{ animationDelay: '-0.4s', animationDirection: 'reverse', transform: 'translate(2px, -2px)' }} />
              </div>
              <FaWolfPackBattalion className="relative z-10 h-6 w-6 text-zinc-900 dark:text-zinc-100" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-start gap-1.5">
                <span className="font-semibold tracking-tight leading-none">N E X A 1337</span>
                <span className="px-1 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[8px] font-bold uppercase tracking-wider leading-none -mt-1">Beta</span>
              </div>
              <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 animate-flash leading-none mt-0.5">MultiTool</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
            setTheme(isDark ? "light" : "dark");
          }}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-[#374151] transition-colors"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm dark:bg-black/40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm border-r border-zinc-200/60 bg-white/95 backdrop-blur-xl dark:border-[#374151]/60 dark:bg-[#111827]/95 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="flex h-14 items-center justify-between border-b border-zinc-200/60 px-4 dark:border-[#374151]/60">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-8 w-8 items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FaWolfPackBattalion className="absolute h-6 w-6 text-cyan-400/70 mix-blend-screen animate-glitch" style={{ animationDelay: '-0.2s', transform: 'translate(-2px, 2px)' }} />
                      <FaWolfPackBattalion className="absolute h-6 w-6 text-rose-500/70 mix-blend-screen animate-glitch" style={{ animationDelay: '-0.4s', animationDirection: 'reverse', transform: 'translate(2px, -2px)' }} />
                    </div>
                    <FaWolfPackBattalion className="relative z-10 h-6 w-6 text-zinc-900 dark:text-zinc-100" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-start gap-1.5">
                      <span className="font-semibold tracking-tight leading-none">N E X A 1337</span>
                      <span className="px-1 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[8px] font-bold uppercase tracking-wider leading-none -mt-1">Beta</span>
                    </div>
                    <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 animate-flash leading-none mt-0.5">MultiTool</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-[#374151] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-auto py-4">
                <nav className="grid gap-1 px-3">
                  {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800/60 dark:text-zinc-50"
                            : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/30 dark:hover:text-zinc-50"
                        )}
                      >
                        <item.icon className={cn("h-5 w-5", isActive && "text-zinc-900 dark:text-zinc-50")} />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function AppLayout() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50/50 dark:bg-[#111827] text-zinc-950 dark:text-zinc-50 selection:bg-zinc-200 dark:selection:bg-zinc-800">
      <Sidebar onOpenPopup={() => setIsPopupOpen(true)} />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <MobileHeader />
        <main className="flex-1 overflow-auto relative flex flex-col">
          <Outlet />
        </main>
      </div>
      <NexaPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
}

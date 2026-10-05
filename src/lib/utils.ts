import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(num: number) {
  return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
}


import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Money formatting is now handled by the <Money /> component in components/Money.tsx
// This file is kept if other utilities are needed in the future.
export const formatMoney = (amount: number, lang: string): string => {
   // Deprecated: prefer using <Money value={amount} /> component
   return amount.toString();
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

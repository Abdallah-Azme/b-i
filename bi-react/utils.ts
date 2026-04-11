
// Money formatting is now handled by the <Money /> component in components/Money.tsx
// This file is kept if other utilities are needed in the future.
export const formatMoney = (amount: number, lang: string): string => {
   // Deprecated: prefer using <Money value={amount} /> component
   return amount.toString();
};

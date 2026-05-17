import type { ReactNode } from 'react';

type BadgeVariant = 'blue' | 'amber' | 'emerald' | 'red' | 'purple' | 'pink' | 'teal' | 'gray';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  /** Adds a small dot indicator before the label */
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  blue: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
  amber: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
  red: 'bg-red-500/10 text-red-400 ring-red-500/20',
  purple: 'bg-purple-500/10 text-purple-400 ring-purple-500/20',
  pink: 'bg-pink-500/10 text-pink-400 ring-pink-500/20',
  teal: 'bg-teal-500/10 text-teal-400 ring-teal-500/20',
  gray: 'bg-zinc-500/10 text-zinc-400 ring-zinc-500/20',
};

const dotColors: Record<BadgeVariant, string> = {
  blue: 'bg-blue-400',
  amber: 'bg-amber-400',
  emerald: 'bg-emerald-400',
  red: 'bg-red-400',
  purple: 'bg-purple-400',
  pink: 'bg-pink-400',
  teal: 'bg-teal-400',
  gray: 'bg-zinc-400',
};

/* Light-mode overrides — used when .dark is NOT on the root */
const lightVariantStyles: Record<BadgeVariant, string> = {
  blue: 'bg-blue-100 text-blue-700 ring-blue-200',
  amber: 'bg-amber-100 text-amber-700 ring-amber-200',
  emerald: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  red: 'bg-red-100 text-red-700 ring-red-200',
  purple: 'bg-purple-100 text-purple-700 ring-purple-200',
  pink: 'bg-pink-100 text-pink-700 ring-pink-200',
  teal: 'bg-teal-100 text-teal-700 ring-teal-200',
  gray: 'bg-zinc-100 text-zinc-700 ring-zinc-200',
};

const lightDotColors: Record<BadgeVariant, string> = {
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  teal: 'bg-teal-500',
  gray: 'bg-zinc-500',
};

const Badge = ({ children, variant = 'gray', dot = false }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${lightVariantStyles[variant]} dark:${variantStyles[variant]}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${lightDotColors[variant]} dark:${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;

/* ─── Mapping helpers ─────────────────────────────────── */
export const statusVariant = (status: string): BadgeVariant => {
  switch (status) {
    case 'New':        return 'blue';
    case 'Contacted':  return 'amber';
    case 'Qualified':  return 'emerald';
    case 'Lost':       return 'red';
    default:           return 'gray';
  }
};

export const sourceVariant = (source: string): BadgeVariant => {
  switch (source) {
    case 'Website':    return 'purple';
    case 'Instagram':  return 'pink';
    case 'Referral':   return 'teal';
    default:           return 'gray';
  }
};

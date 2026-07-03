import type { ToolDifficulty } from '@/registry'

type BadgeVariant = 'new' | 'beta' | 'popular' | 'premium' | 'difficulty' | 'time' | 'coming-soon'

interface ToolBadgeProps {
  variant: BadgeVariant
  value?: string
}

const BADGE_CONFIG: Record<
  BadgeVariant,
  { label: (v?: string) => string; className: string }
> = {
  new: {
    label: () => 'New',
    className:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800',
  },
  beta: {
    label: () => 'Beta',
    className:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800',
  },
  popular: {
    label: () => 'Popular',
    className:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 ring-1 ring-orange-200 dark:ring-orange-800',
  },
  premium: {
    label: () => 'Premium',
    className:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 ring-1 ring-purple-200 dark:ring-purple-800',
  },
  'coming-soon': {
    label: () => 'Coming Soon',
    className:
      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-700',
  },
  difficulty: {
    label: (v) => {
      const map: Partial<Record<ToolDifficulty, string>> = {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
      }
      return map[v as ToolDifficulty] ?? v ?? 'Beginner'
    },
    className:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800',
  },
  time: {
    label: (v) => v ?? '',
    className:
      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-700',
  },
}

/**
 * ToolBadge
 * Small status/metadata chip shown in the tool header.
 */
export function ToolBadge({ variant, value }: ToolBadgeProps) {
  const config = BADGE_CONFIG[variant]

  const label = config.label(value)
  if (!label) return null

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${config.className}`}
    >
      {label}
    </span>
  )
}

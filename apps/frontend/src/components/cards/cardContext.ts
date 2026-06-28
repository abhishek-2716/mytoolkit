import { createContext, useContext } from 'react'

import type { CardPadding, CardRadius, SurfaceVariant } from './cardVariants'

/* ─── Context value ──────────────────────────────────────────────────────── */

export interface CardContextValue {
  /** Visual variant inherited by sub-components */
  variant: SurfaceVariant
  /** Padding scale — shared so CardHeader/Content/Footer align */
  padding: CardPadding
  /** Border-radius scale */
  radius: CardRadius
  /** Whether the card is disabled */
  disabled: boolean
}

const defaultValue: CardContextValue = {
  variant: 'default',
  padding: 'md',
  radius: 'lg',
  disabled: false,
}

export const CardContext = createContext<CardContextValue>(defaultValue)

/**
 * Access the nearest Card's context.
 * Safe to call outside a Card — returns default values.
 */
export function useCardContext(): CardContextValue {
  return useContext(CardContext)
}

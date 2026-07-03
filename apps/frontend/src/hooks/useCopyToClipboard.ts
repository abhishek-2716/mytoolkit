import { useCallback, useState } from 'react'

/**
 * useCopyToClipboard
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Copies text to the system clipboard.
 *
 * Returns:
 *  - `copy(text)`  — async function to copy text
 *  - `isCopied`    — true for ~2 seconds after a successful copy
 *  - `error`       — error message if copy failed
 *
 * @example
 * const { copy, isCopied } = useCopyToClipboard()
 * <button onClick={() => copy(outputText)}>
 *   {isCopied ? 'Copied!' : 'Copy'}
 * </button>
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function useCopyToClipboard(resetMs = 2000) {
  const [isCopied, setIsCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!text) return false

      try {
        await navigator.clipboard.writeText(text)
        setIsCopied(true)
        setError(null)
        setTimeout(() => {
          setIsCopied(false)
        }, resetMs)
        return true
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Copy failed'
        setError(message)
        setIsCopied(false)
        return false
      }
    },
    [resetMs]
  )

  return { copy, isCopied, error }
}

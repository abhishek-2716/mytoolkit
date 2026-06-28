import { forwardRef, useCallback, useState } from 'react'

import { Button, type ButtonProps } from './Button'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface LoadingButtonProps extends Omit<ButtonProps, 'onClick'> {
  /**
   * Async click handler.
   *
   * When provided, the button automatically:
   *  1. Sets its internal loading state to `true`
   *  2. Shows a spinner and disables interaction (prevents double-clicks)
   *  3. Awaits the returned Promise
   *  4. Resets loading state when the Promise resolves OR rejects
   *
   * Errors thrown by `onAsyncClick` are re-thrown after the loading state
   * is cleared. Handle them in a try/catch in your handler or via the parent.
   */
  onAsyncClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>
  /**
   * External loading flag.
   * Merged with the internal async state — the button is in loading state
   * if EITHER this prop or the internal async state is true.
   */
  loading?: boolean
  /**
   * Text displayed while the button is in the loading state.
   * When omitted, the original `children` remain visible alongside the spinner.
   *
   * @example loadingText="Saving…"
   */
  loadingText?: string
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * LoadingButton — a Button with automatic async loading state management.
 *
 * Prevents double-submission: once an async operation starts, the button
 * is disabled until the Promise settles. This makes it ideal for form
 * submissions, API calls, and file operations.
 *
 * Supports both:
 *  - Automatic: `onAsyncClick` — the button manages its own loading state
 *  - Manual:    `loading` prop — external state (e.g., from React Query)
 *
 * @example
 * // Automatic loading state (most common)
 * <LoadingButton
 *   onAsyncClick={async () => {
 *     await saveDocument()
 *   }}
 *   loadingText="Saving…"
 * >
 *   Save document
 * </LoadingButton>
 *
 * @example
 * // External loading state (React Query mutation)
 * <LoadingButton
 *   loading={deleteMutation.isPending}
 *   onClick={() => deleteMutation.mutate(id)}
 *   variant="danger"
 *   loadingText="Deleting…"
 * >
 *   Delete file
 * </LoadingButton>
 *
 * @example
 * // Combined: external + auto
 * <LoadingButton
 *   loading={isFetching}
 *   onAsyncClick={handleSubmit}
 * >
 *   Submit
 * </LoadingButton>
 */
export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  function LoadingButton(
    { onAsyncClick, loading: externalLoading = false, loadingText, children, ...props },
    ref
  ) {
    const [internalLoading, setInternalLoading] = useState(false)
    const isLoading = internalLoading || externalLoading

    const handleClick = useCallback(
      async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!onAsyncClick || isLoading) return

        setInternalLoading(true)
        try {
          await onAsyncClick(e)
        } finally {
          setInternalLoading(false)
        }
      },
      [onAsyncClick, isLoading]
    )

    return (
      <Button
        ref={ref}
        loading={isLoading}
        onClick={
          onAsyncClick
            ? (e) => {
                void handleClick(e)
              }
            : undefined
        }
        {...props}
      >
        {isLoading && loadingText ? loadingText : children}
      </Button>
    )
  }
)

LoadingButton.displayName = 'LoadingButton'

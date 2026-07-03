import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { z } from 'zod'

import { Button } from '@/components/common'
import { EmailInput, FormGroup } from '@/components/forms'
import { CtaSection } from '@/components/layout'

/* ─── Schema ─────────────────────────────────────────────────────────────── */

const newsletterSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
})

type NewsletterFormValues = z.infer<typeof newsletterSchema>

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * NewsletterBanner — email subscription section at the bottom of the homepage.
 *
 * Validation only — no backend connection in this phase.
 * Form is reset after simulated submission.
 */
export function NewsletterBanner() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
  })

  const onSubmit = async (_data: NewsletterFormValues) => {
    // Simulated async delay — replace with API call in future phase
    await new Promise((resolve) => { setTimeout(resolve, 800) })
    setSubmitted(true)
    reset()
  }

  return (
    <CtaSection container="content" aria-labelledby="newsletter-heading">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2
          id="newsletter-heading"
          className="type-h2 text-primary-foreground text-balance"
        >
          Stay in the Loop
        </h2>
        <p className="mt-3 type-body-md text-primary-foreground/80 max-w-md mx-auto">
          Get notified when we launch new tools, improvements, and features.
          No spam — unsubscribe anytime.
        </p>

        {submitted ? (
          /* Success state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-foreground/10 px-6 py-4"
            role="status"
            aria-live="polite"
          >
            <span className="text-2xl" aria-hidden="true">🎉</span>
            <p className="type-body-md font-medium text-primary-foreground">
              You're on the list! We'll be in touch soon.
            </p>
          </motion.div>
        ) : (
          /* Form */
          <form
            onSubmit={(e) => { void handleSubmit(onSubmit)(e) }}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            aria-label="Newsletter subscription form"
            noValidate
          >
            <FormGroup
              error={errors.email}
              className="flex-1"
            >
              <EmailInput
                {...register('email')}
                placeholder="you@example.com"
                aria-label="Email address for newsletter"
                disabled={isSubmitting}
              />
            </FormGroup>

            <Button
              type="submit"
              variant="secondary"
              size="md"
              loading={isSubmitting}
              className="shrink-0 sm:self-start"
            >
              Subscribe
            </Button>
          </form>
        )}

        <p className="mt-4 type-caption text-primary-foreground/60">
          By subscribing you agree to our{' '}
          <a
            href="/privacy"
            className="underline hover:text-primary-foreground transition-colors focus-visible:outline-none focus-visible:text-primary-foreground"
          >
            Privacy Policy
          </a>
          . No spam, ever.
        </p>
      </motion.div>
    </CtaSection>
  )
}

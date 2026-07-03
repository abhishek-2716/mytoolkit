import { Link } from 'react-router-dom'
import { ExternalLinkIcon } from 'lucide-react'

import { cn } from '@/utils'
import { appConfig } from '@/config'
import { ROUTES } from '@/constants'

import { Logo } from './Logo'

/* ─── Footer link data ───────────────────────────────────────────────────── */

const FOOTER_COLUMNS = [
  {
    id: 'tools',
    label: 'Popular Tools',
    links: [
      { label: 'PDF to Word', href: '/tools/pdf-to-word' },
      { label: 'Image Compressor', href: '/tools/image-compressor' },
      { label: 'Background Remover', href: '/tools/background-remover' },
      { label: 'JSON Formatter', href: '/tools/json-formatter' },
      { label: 'Password Generator', href: '/tools/password-generator' },
    ],
  },
  {
    id: 'categories',
    label: 'Categories',
    links: [
      { label: 'PDF Tools', href: '/category/pdf' },
      { label: 'Image Tools', href: '/category/image' },
      { label: 'Developer Tools', href: '/category/developer' },
      { label: 'AI Tools', href: '/category/ai' },
      { label: 'Text Tools', href: '/category/text' },
    ],
  },
  {
    id: 'company',
    label: 'Platform',
    links: [
      { label: 'All Tools', href: ROUTES.TOOLS },
      { label: 'Blog', href: ROUTES.BLOG },
      { label: 'About', href: ROUTES.ABOUT },
      { label: 'Contact', href: ROUTES.CONTACT },
      { label: 'FAQ', href: ROUTES.FAQ },
    ],
  },
  {
    id: 'legal',
    label: 'Legal',
    links: [
      { label: 'Privacy Policy', href: ROUTES.PRIVACY },
      { label: 'Terms of Service', href: ROUTES.TERMS },
      { label: 'Cookie Policy', href: ROUTES.COOKIES },
    ],
  },
]

const SOCIAL_LINKS = [
  {
    label: 'Twitter',
    href: 'https://twitter.com/mytoolshub',
    icon: ExternalLinkIcon,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/abhishek-2716',
    icon: ExternalLinkIcon,
  },
]

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * Footer — site-wide footer with navigation columns, social links, and legal.
 *
 * Self-contained: pulls link data from internal constants + appConfig.
 * Replace the placeholder footer in all layouts with this component.
 */
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      role="contentinfo"
      className="border-t border-border bg-surface"
    >
      {/* ── Main footer grid ── */}
      <div className="container py-14 lg:py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand column — spans 2 cols on large screens */}
          <div className="col-span-2 lg:col-span-2">
            <Logo variant="full" size="md" />
            <p className="mt-4 type-body-sm text-foreground-muted leading-relaxed max-w-xs">
              Free online tools for everyone. PDF, image, text, developer utilities
              and more — no registration required.
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3" aria-label="Social media links">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg',
                    'border border-border bg-background text-foreground-muted',
                    'hover:border-primary/40 hover:text-primary hover:bg-primary-subtle',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    'transition-colors duration-150'
                  )}
                >
                  <Icon size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation columns */}
          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.id} aria-label={col.label}>
              <h3 className="type-label font-semibold text-foreground uppercase tracking-wider mb-4">
                {col.label}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className={cn(
                        'type-body-sm text-foreground-muted',
                        'hover:text-primary transition-colors duration-150',
                        'focus-visible:outline-none focus-visible:text-primary'
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
          <p className="type-caption text-foreground-muted text-center sm:text-left">
            © {currentYear} {appConfig.name}. All rights reserved.
          </p>
          <p className="type-caption text-foreground-disabled">
            Free tools, forever.
          </p>
        </div>
      </div>
    </footer>
  )
}

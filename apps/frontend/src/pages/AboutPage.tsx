import { Link } from 'react-router-dom'

import { JsonLd, MetaTags } from '@/components/seo'
import { appConfig } from '@/config'
import { ROUTES } from '@/constants'
import { registryStats } from '@/registry'

/* ─── JSON-LD ───────────────────────────────────────────────────────────── */

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: `About ${appConfig.name}`,
  url: `${appConfig.url}/about`,
  description: `Learn about ${appConfig.name} — our mission to make free online tools fast, accessible, and easy to use for everyone worldwide.`,
  mainEntity: {
    '@type': 'Organization',
    name: appConfig.name,
    url: appConfig.url,
    description: `${appConfig.name} offers ${registryStats.activeTools}+ free online tools for PDF, images, text, developers, calculators & generators. No signup. Works instantly in your browser.`,
    founder: { '@type': 'Person', name: 'Abhishek Sharma' },
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: appConfig.url },
    { '@type': 'ListItem', position: 2, name: 'About', item: `${appConfig.url}/about` },
  ],
}

/** AboutPage */
export default function AboutPage() {
  return (
    <>
      <MetaTags
        title="About Us — Our Mission & Story"
        description={`Learn about ${appConfig.name} — our mission to make free online tools fast, accessible, and easy to use for everyone worldwide. No account needed.`}
        canonical={`${appConfig.url}/about`}
        keywords={[
          `about ${appConfig.name.toLowerCase()}`,
          'free online tools website',
          'online tools mission',
          'best free tools website',
          'tools for everyone free',
          'privacy first browser tools',
          'no signup online tools',
        ]}
      />
      <JsonLd data={aboutSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="min-h-screen bg-background">
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground mb-8">
            <Link to={ROUTES.HOME} className="hover:text-foreground transition-colors">Home</Link>
            <span aria-hidden="true" className="mx-1">/</span>
            <span className="text-foreground font-medium">About</span>
          </nav>

          {/* Header */}
          <h1 className="text-3xl font-bold text-foreground">About {appConfig.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Our mission is to make everyday digital tasks fast, free, and accessible for everyone — no account, no bloat, no nonsense.
          </p>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: `${registryStats.activeTools}+`, label: 'Active Tools' },
              { value: `${registryStats.totalCategories}`, label: 'Categories' },
              { value: '100%', label: 'Free Forever' },
              { value: '0', label: 'Signups Needed' },
            ].map(({ value, label }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="text-2xl font-extrabold text-primary">{value}</div>
                <div className="text-xs text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Story */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-foreground">Our Story</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {appConfig.name} started as a personal project born out of frustration with cluttered, ad-heavy tools on the internet.
              The idea was simple — build a collection of clean, fast, and genuinely useful utilities that anyone can use
              directly in the browser without signing up or paying anything.
            </p>
          </div>

          {/* What we offer */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-foreground">What We Offer</h2>
            <ul className="mt-3 space-y-2 list-disc list-inside text-muted-foreground">
              <li>100% free tools — forever, no hidden plans</li>
              <li>No sign-up or account required</li>
              <li>Privacy-first: your data never leaves your browser</li>
              <li>Fast, lightweight, and mobile-friendly</li>
              <li>Regularly updated with new tools based on community feedback</li>
            </ul>
          </div>

          {/* Values */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { title: '🔒 Privacy First', desc: 'All processing happens in your browser. Zero data leaves your device.' },
              { title: '⚡ Fast by Default', desc: 'No servers, no queues. Instant results powered by your own hardware.' },
              { title: '❤️ Always Free', desc: 'Core tools are free forever. No bait-and-switch. No paywalls.' },
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          {/* Creator */}
          <div className="mt-12 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4 mb-3">
              <img
                src="/abhishek.jpg"
                alt="Abhishek Sharma"
                className="rounded-full object-cover shrink-0 w-16 h-16"
                width={64}
                height={64}
              />
              <div>
                <h2 className="text-lg font-semibold text-foreground">Meet the Creator</h2>
                <p className="text-sm text-muted-foreground">Abhishek Sharma — Developer & Builder</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Hi, I'm{' '}
              <span className="font-semibold text-foreground">Abhishek Sharma</span>
              {' '}— a developer passionate about building tools that solve real-world problems.
              I built {appConfig.name} to give people a reliable, distraction-free place to get things done online.
              Every tool here is crafted with care to be fast, intuitive, and genuinely helpful.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to={ROUTES.TOOLS}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Browse All Tools
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-background text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

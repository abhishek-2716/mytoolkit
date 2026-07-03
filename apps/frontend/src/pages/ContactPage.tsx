import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MailIcon, MessageSquareIcon, SendIcon } from 'lucide-react'

import { JsonLd, MetaTags } from '@/components/seo'
import { appConfig } from '@/config'
import { ROUTES } from '@/constants'

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: appConfig.url },
    { '@type': 'ListItem', position: 2, name: 'Contact', item: `${appConfig.url}/contact` },
  ],
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

/** ContactPage */
export default function ContactPage() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    // Simulated submission — replace with real API in backend phase
    await new Promise((r) => { setTimeout(r, 800) })
    setStatus('success')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const inputClass =
    'w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 transition-colors'
  const labelClass = 'block text-sm font-medium text-foreground mb-1.5'

  return (
    <>
      <MetaTags
        title="Contact Us"
        description={`Get in touch with the ${appConfig.name} team. Report bugs, suggest new tools, or ask for help. We respond to every message.`}
        canonical={`${appConfig.url}/contact`}
        keywords={[
          `contact ${appConfig.name.toLowerCase()}`,
          'report bug online tool',
          'suggest new online tool',
          'online tools support',
          'help free tools',
          'feedback online tools',
        ]}
      />
      <JsonLd data={breadcrumbSchema} />

      <div className="min-h-screen bg-background">
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground mb-8">
            <Link to={ROUTES.HOME} className="hover:text-foreground transition-colors">Home</Link>
            <span aria-hidden="true" className="mx-1">/</span>
            <span className="text-foreground font-medium">Contact</span>
          </nav>

          <h1 className="text-3xl font-bold text-foreground">Contact Us</h1>
          <p className="mt-4 text-muted-foreground">
            Found a bug? Want to suggest a tool? Have a question? We'd love to hear from you.
          </p>

          {/* Contact options */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5 flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <MailIcon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Email Support</h2>
                <p className="text-sm text-muted-foreground mt-0.5">For detailed questions and bug reports</p>
                <a
                  href="mailto:support@mytoolshub.com"
                  className="text-sm text-primary hover:underline mt-1 inline-block"
                >
                  support@mytoolshub.com
                </a>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <MessageSquareIcon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Feature Requests</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Suggest a new tool or improvement</p>
                <p className="text-sm text-muted-foreground mt-1">Use the form below</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="mt-10 rounded-xl border border-border bg-card p-6">
            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-4">
                  <SendIcon className="w-6 h-6" aria-hidden="true" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Message Sent!</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Thanks for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => { setStatus('idle') }}
                  className="mt-6 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { void handleSubmit(e) }} className="space-y-5" noValidate>
                <h2 className="text-lg font-semibold text-foreground mb-2">Send a Message</h2>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => { setFormData((p) => ({ ...p, name: e.target.value })) }}
                      disabled={status === 'submitting'}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => { setFormData((p) => ({ ...p, email: e.target.value })) }}
                      disabled={status === 'submitting'}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className={labelClass}>Subject</label>
                  <select
                    id="contact-subject"
                    required
                    value={formData.subject}
                    onChange={(e) => { setFormData((p) => ({ ...p, subject: e.target.value })) }}
                    disabled={status === 'submitting'}
                    className={inputClass}
                  >
                    <option value="">Select a subject</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request / New Tool</option>
                    <option value="question">General Question</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className={labelClass}>Message</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    placeholder="Describe your issue, suggestion, or question..."
                    value={formData.message}
                    onChange={(e) => { setFormData((p) => ({ ...p, message: e.target.value })) }}
                    disabled={status === 'submitting'}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting' || !formData.name || !formData.email || !formData.message || !formData.subject}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {status === 'submitting' ? (
                    <><span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />Sending...</>
                  ) : (
                    <><SendIcon className="w-4 h-4" aria-hidden="true" />Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

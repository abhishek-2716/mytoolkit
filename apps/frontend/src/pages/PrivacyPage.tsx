import { MetaTags } from '@/components/seo'

/** PrivacyPage */
export default function PrivacyPage() {
  return (
    <>
      <MetaTags
        title="Privacy Policy"
        description="MyToolsHub privacy policy — your files are processed locally in your browser. We do not store, upload, or share your data. 100% private and secure."
        keywords={[
          'privacy policy free online tools',
          'does the tool upload my files',
          'safe online tools privacy',
          'browser based tools no data stored',
          'privacy friendly tools online',
          'gdpr compliant free tools',
        ]}
      />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-4" style={{ color: 'var(--color-muted-foreground)' }}>
          Privacy policy content — to be written before launch.
        </p>
      </section>
    </>
  )
}

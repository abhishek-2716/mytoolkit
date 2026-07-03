import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('🌱  Seeding database...')

  // ── Super Admin ─────────────────────────────────────────────────────────
  const email = process.env.ADMIN_EMAIL || 'admin@mytoolshub.com'
  const plainPw = process.env.ADMIN_PASSWORD || 'Admin@1212'
  const name = process.env.ADMIN_NAME || 'Admin'

  const existing = await prisma.user.findUnique({ where: { email } })
  if (!existing) {
    const hashed = await bcrypt.hash(plainPw, 12)
    await prisma.user.create({
      data: { email, password: hashed, name, role: 'SUPER_ADMIN' },
    })
    console.log(`✅  Admin created: ${email}`)
  } else {
    console.log(`ℹ️   Admin already exists: ${email}`)
  }

  // ── Default Author ───────────────────────────────────────────────────────
  const defaultAuthor = await prisma.author.findUnique({ where: { slug: 'mytoolshub-team' } })
  if (!defaultAuthor) {
    await prisma.author.create({
      data: {
        name: 'MyToolsHub Team',
        slug: 'mytoolshub-team',
        bio: 'The team behind MyToolsHub — building 100+ free browser tools.',
        isActive: true,
      },
    })
    console.log('✅  Default author created')
  }

  // ── Blog Categories ──────────────────────────────────────────────────────
  const categories = [
    { name: 'Tutorials', slug: 'tutorials', color: '#6366f1', icon: 'BookOpen', order: 1 },
    { name: 'Tips & Tricks', slug: 'tips-tricks', color: '#10b981', icon: 'Lightbulb', order: 2 },
    { name: 'Tool Updates', slug: 'tool-updates', color: '#f59e0b', icon: 'Wrench', order: 3 },
    { name: 'Developer', slug: 'developer', color: '#3b82f6', icon: 'Code', order: 4 },
    { name: 'Productivity', slug: 'productivity', color: '#8b5cf6', icon: 'Zap', order: 5 },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({ where: { slug: cat.slug }, create: cat, update: cat })
  }
  console.log('✅  Blog categories seeded')

  // ── Default FAQ ──────────────────────────────────────────────────────────
  const faqs = [
    { question: 'Are all tools completely free?', answer: 'Yes! All 100+ tools on MyToolsHub are completely free to use with no signup required.', category: 'general', order: 1 },
    { question: 'Do you store my files or data?', answer: 'No. All processing happens entirely in your browser. No files or data are ever uploaded to our servers.', category: 'general', order: 2 },
    { question: 'How many tools are available?', answer: 'We currently have 100+ active tools across categories including PDF, images, text, developer tools, calculators, and generators.', category: 'tools', order: 1 },
    { question: 'Can I use these tools on mobile?', answer: 'Absolutely! MyToolsHub is fully responsive and works on all devices — desktop, tablet, and mobile.', category: 'tools', order: 2 },
    { question: 'How can I suggest a new tool?', answer: 'Use the Contact page to send us your suggestion. We regularly review and add new tools based on user feedback.', category: 'general', order: 3 },
  ]

  for (const faq of faqs) {
    await prisma.faq.upsert({
      where: { id: `faq-${faq.order}-${faq.category}` },
      create: { id: `faq-${faq.order}-${faq.category}`, ...faq },
      update: faq,
    })
  }
  console.log('✅  FAQs seeded')

  // ── Footer Links ─────────────────────────────────────────────────────────
  const footerLinks = [
    { label: 'About', url: '/about', section: 'company', order: 1 },
    { label: 'Blog', url: '/blog', section: 'company', order: 2 },
    { label: 'Contact', url: '/contact', section: 'company', order: 3 },
    { label: 'All Tools', url: '/tools', section: 'tools', order: 1 },
    { label: 'PDF Tools', url: '/tools?category=pdf', section: 'tools', order: 2 },
    { label: 'Image Tools', url: '/tools?category=image', section: 'tools', order: 3 },
    { label: 'Privacy Policy', url: '/privacy', section: 'legal', order: 1 },
    { label: 'Terms of Service', url: '/terms', section: 'legal', order: 2 },
    { label: 'Cookie Policy', url: '/cookies', section: 'legal', order: 3 },
  ]

  for (const link of footerLinks) {
    await prisma.footerLink.upsert({
      where: { id: `footer-${link.section}-${link.order}` },
      create: { id: `footer-${link.section}-${link.order}`, ...link },
      update: link,
    })
  }
  console.log('✅  Footer links seeded')

  // ── About Page ───────────────────────────────────────────────────────────
  await prisma.aboutPage.upsert({
    where: { id: 'singleton' },
    create: {
      id: 'singleton',
      heroTitle: 'Built for Everyone. Free Forever.',
      heroSubtext: 'MyToolsHub is a collection of 100+ free browser-based tools that help you work smarter — no signup, no tracking, no cost.',
      mission: 'To make powerful productivity tools accessible to everyone, everywhere, for free.',
      vision: 'A world where great tools are not locked behind paywalls.',
      stats: [
        { label: 'Active Tools', value: '100+' },
        { label: 'Monthly Users', value: '10K+' },
        { label: 'Tools Added', value: 'Monthly' },
        { label: 'Cost to Use', value: '$0' },
      ],
    },
    update: {},
  })
  console.log('✅  About page seeded')

  console.log('\n🎉  Seed complete!')
}

main()
  .catch((e) => {
    console.error('❌  Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

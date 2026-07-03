import type { ReactElement } from 'react'

/**
 * Tool Router
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Maps tool slugs to their lazy-loaded ToolEngine configs.
 * Only active/implemented tools appear here.
 *
 * Pattern:
 *  - Slug from registry → async import of config
 *  - The ToolDetailPage resolves the config and renders <ToolEngine config={...} />
 *
 * Add new tools here AFTER:
 *  1. Adding their ToolMeta to the category registry file
 *  2. Creating their config file under features/tools/{slug}/
 *  3. Changing their registry status to 'active'
 *
 * ══════════════════════════════════════════════════════════════════════════
 */

type ToolPageLoader = () => Promise<{ default: () => ReactElement }>

/** Map of slug → lazy page component loader */
export const toolPageRouter: Record<string, ToolPageLoader> = {
  // ── Existing tools ────────────────────────────────────────────────────
  'json-formatter': () => import('./json-formatter/JsonFormatterPage'),
  'word-counter': () => import('./word-counter/WordCounterPage'),
  'uuid-generator': () => import('./uuid-generator/UuidGeneratorPage'),

  // ── Phase 1: Text Tools ───────────────────────────────────────────────
  'case-converter': () => import('./case-converter/CaseConverterPage'),
  'text-to-slug': () => import('./text-to-slug/TextToSlugPage'),
  'lorem-ipsum': () => import('./lorem-ipsum/LoremIpsumPage'),
  'remove-duplicate-lines': () => import('./remove-duplicate-lines/RemoveDuplicateLinesPage'),
  'text-sorter': () => import('./text-sorter/TextSorterPage'),
  'text-reverser': () => import('./text-reverser/TextReverserPage'),
  'remove-whitespace': () => import('./remove-whitespace/RemoveWhitespacePage'),
  'text-compare': () => import('./text-compare/TextComparePage'),

  // ── Phase 1: Encoding Tools ───────────────────────────────────────────
  'base64-encoder': () => import('./base64-encoder/Base64EncoderPage'),
  'url-encoder': () => import('./url-encoder/UrlEncoderPage'),
  'html-encoder': () => import('./html-encoder/HtmlEncoderPage'),

  // ── Phase 2: JSON Tools ───────────────────────────────────────────────
  'json-validator': () => import('./json-validator/JsonValidatorPage'),
  'json-minifier': () => import('./json-minifier/JsonMinifierPage'),
  'json-compare': () => import('./json-compare/JsonComparePage'),
  'json-to-yaml': () => import('./json-to-yaml/JsonToYamlPage'),
  'yaml-to-json': () => import('./yaml-to-json/YamlToJsonPage'),
  'json-to-csv': () => import('./json-to-csv/JsonToCsvPage'),
  'csv-to-json': () => import('./csv-to-json/CsvToJsonPage'),

  // ── Phase 3: Text Analysis ────────────────────────────────────────────
  'character-counter': () => import('./character-counter/CharacterCounterPage'),
  'find-and-replace': () => import('./find-and-replace/FindAndReplacePage'),
  'keyword-density': () => import('./keyword-density/KeywordDensityPage'),
  'readability-checker': () => import('./readability-checker/ReadabilityCheckerPage'),

  // ── Phase 3: Calculators ──────────────────────────────────────────────
  'percentage-calculator': () => import('./percentage-calculator/PercentageCalculatorPage'),
  'age-calculator': () => import('./age-calculator/AgeCalculatorPage'),
  'bmi-calculator': () => import('./bmi-calculator/BmiCalculatorPage'),
  'loan-calculator': () => import('./loan-calculator/LoanCalculatorPage'),
  'tip-calculator': () => import('./tip-calculator/TipCalculatorPage'),
  'gst-calculator': () => import('./gst-calculator/GstCalculatorPage'),

  // ── Phase 3: Dev / Encoding Tools ─────────────────────────────────────
  'color-converter': () => import('./color-converter/ColorConverterPage'),
  'timestamp-converter': () => import('./timestamp-converter/TimestampConverterPage'),
  'password-generator': () => import('./password-generator/PasswordGeneratorPage'),
  'jwt-decoder': () => import('./jwt-decoder/JwtDecoderPage'),
  'regex-tester': () => import('./regex-tester/RegexTesterPage'),
  'hash-generator': () => import('./hash-generator/HashGeneratorPage'),

  // ── Phase 3: SEO / Web Tools ──────────────────────────────────────────
  'meta-generator': () => import('./meta-generator/MetaGeneratorPage'),
  'og-generator': () => import('./og-generator/OgGeneratorPage'),
  'robots-generator': () => import('./robots-generator/RobotsGeneratorPage'),
  'css-gradient-generator': () => import('./css-gradient-generator/CssGradientGeneratorPage'),

  // ── Phase 4: New Tools ────────────────────────────────────────────────
  'markdown-preview': () => import('./markdown-preview/MarkdownPreviewPage'),
  'qr-code-generator': () => import('./qr-code-generator/QrCodeGeneratorPage'),
  'color-palette-generator': () => import('./color-palette-generator/ColorPaletteGeneratorPage'),
  'sitemap-generator': () => import('./sitemap-generator/SitemapGeneratorPage'),
  'image-to-base64': () => import('./image-to-base64/ImageToBase64Page'),
  'image-grayscale': () => import('./image-grayscale/ImageGrayscalePage'),
  'image-rotate': () => import('./image-rotate/ImageRotatePage'),
  'image-flip': () => import('./image-flip/ImageFlipPage'),
  'image-compress': () => import('./image-compress/ImageCompressPage'),
  'image-resize': () => import('./image-resize/ImageResizePage'),
  'image-brightness': () => import('./image-brightness/ImageBrightnessPage'),

  // ── Sprint 7: New Text Tools ───────────────────────────────────────────
  'morse-code-converter': () => import('./morse-code-converter/MorseCodeConverterPage'),
  'binary-converter': () => import('./binary-converter/BinaryConverterPage'),
  'nato-alphabet': () => import('./nato-alphabet/NatoAlphabetPage'),
  'text-statistics': () => import('./text-statistics/TextStatisticsPage'),
  'html-to-text': () => import('./html-to-text/HtmlToTextPage'),
  'palindrome-checker': () => import('./palindrome-checker/PalindromeCheckerPage'),
  'roman-numeral-converter': () => import('./roman-numeral-converter/RomanNumeralConverterPage'),

  // ── Sprint 7: New Developer Tools ─────────────────────────────────────
  'number-base-converter': () => import('./number-base-converter/NumberBaseConverterPage'),
  'cron-expression-parser': () => import('./cron-expression-parser/CronExpressionParserPage'),
  'html-formatter': () => import('./html-formatter/HtmlFormatterPage'),
  'xml-formatter': () => import('./xml-formatter/XmlFormatterPage'),
  'xml-to-json': () => import('./xml-to-json/XmlToJsonPage'),
  'json-to-xml': () => import('./json-to-xml/JsonToXmlPage'),
  'markdown-to-html': () => import('./markdown-to-html/MarkdownToHtmlPage'),
  'css-minifier': () => import('./css-minifier/CssMinifierPage'),
  'ip-address-validator': () => import('./ip-address-validator/IpAddressValidatorPage'),

  // ── Sprint 7: New Calculator Tools ────────────────────────────────────
  'discount-calculator': () => import('./discount-calculator/DiscountCalculatorPage'),
  'unit-converter': () => import('./unit-converter/UnitConverterPage'),
  'date-calculator': () => import('./date-calculator/DateCalculatorPage'),
  'compound-interest-calculator': () => import('./compound-interest-calculator/CompoundInterestCalculatorPage'),
  'calorie-calculator': () => import('./calorie-calculator/CalorieCalculatorPage'),
  'emi-calculator': () => import('./emi-calculator/EmiCalculatorPage'),
  'speed-calculator': () => import('./speed-calculator/SpeedCalculatorPage'),

  // ── Sprint 7: New SEO Tools ────────────────────────────────────────────
  'utm-builder': () => import('./utm-builder/UtmBuilderPage'),
  'schema-markup-generator': () => import('./schema-markup-generator/SchemaMarkupGeneratorPage'),

  // ── Sprint 7: New Generator Tools ─────────────────────────────────────
  'random-number-generator': () => import('./random-number-generator/RandomNumberGeneratorPage'),
  'placeholder-image-generator': () => import('./placeholder-image-generator/PlaceholderImageGeneratorPage'),
  'favicon-generator': () => import('./favicon-generator/FaviconGeneratorPage'),

  // ── Sprint 8: Image Tools ──────────────────────────────────────────────
  'image-crop': () => import('./image-crop/ImageCropPage'),
  'image-convert': () => import('./image-convert/ImageConvertPage'),
  'image-watermark': () => import('./image-watermark/ImageWatermarkPage'),

  // ── Sprint 8: PDF Tools ────────────────────────────────────────────────
  'pdf-merge': () => import('./pdf-merge/PdfMergePage'),
  'pdf-split': () => import('./pdf-split/PdfSplitPage'),

  // ── Sprint 8: Developer Tools ──────────────────────────────────────────
  'css-beautifier': () => import('./css-beautifier/CssBeautifierPage'),
  'sql-formatter': () => import('./sql-formatter/SqlFormatterPage'),
  'svg-optimizer': () => import('./svg-optimizer/SvgOptimizerPage'),
  'html-minifier': () => import('./html-minifier/HtmlMinifierPage'),
  'uuid-validator': () => import('./uuid-validator/UuidValidatorPage'),
  'uuid-decoder': () => import('./uuid-decoder/UuidDecoderPage'),
  'extract-emails': () => import('./extract-emails/ExtractEmailsPage'),
  'html-preview': () => import('./html-preview/HtmlPreviewPage'),
  'diff-checker': () => import('./diff-checker/DiffCheckerPage'),
  'barcode-generator': () => import('./barcode-generator/BarcodeGeneratorPage'),
  'unix-time-now': () => import('./unix-time-now/UnixTimeNowPage'),
  'color-contrast-checker': () => import('./color-contrast-checker/ColorContrastCheckerPage'),
  'password-strength-checker': () => import('./password-strength-checker/PasswordStrengthCheckerPage'),
  'json-to-table': () => import('./json-to-table/JsonToTablePage'),
  'csv-viewer': () => import('./csv-viewer/CsvViewerPage'),
}

/** Whether a tool slug has an implemented page. */
export function isToolImplemented(slug: string): boolean {
  return slug in toolPageRouter
}

/** Load the tool page component for a given slug. Returns null if not implemented. */
export function loadToolPage(slug: string): ToolPageLoader | null {
  if (!isToolImplemented(slug)) return null
  return toolPageRouter[slug] ?? null
}

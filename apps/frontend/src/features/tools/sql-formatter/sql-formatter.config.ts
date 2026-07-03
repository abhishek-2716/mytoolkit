import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── SQL Formatter ──────────────────────────────────────────────────────── */

const SQL_KEYWORDS = [
  'SELECT', 'DISTINCT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'EXISTS',
  'BETWEEN', 'LIKE', 'IS', 'NULL', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
  'FULL JOIN', 'FULL OUTER JOIN', 'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'CROSS JOIN',
  'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'UNION ALL',
  'INTERSECT', 'EXCEPT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
  'DELETE', 'CREATE TABLE', 'CREATE', 'TABLE', 'ALTER TABLE', 'ALTER', 'DROP TABLE',
  'DROP', 'TRUNCATE', 'AS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'WITH',
  'RETURNING', 'INTO', 'PROCEDURE', 'FUNCTION', 'VIEW', 'INDEX',
]

// Keywords that trigger a new line before them
const NEWLINE_BEFORE = new Set([
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
  'FULL JOIN', 'FULL OUTER JOIN', 'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'CROSS JOIN',
  'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'UNION ALL',
  'INTERSECT', 'EXCEPT', 'SET', 'VALUES', 'RETURNING',
])

function formatSql(sql: string): string {
  // Uppercase all keywords
  let result = sql
  // Sort by length descending to match longer keywords first
  const sorted = [...SQL_KEYWORDS].sort((a, b) => b.length - a.length)
  for (const kw of sorted) {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi')
    result = result.replace(regex, kw)
  }

  // Collapse whitespace
  result = result.replace(/\s+/g, ' ').trim()

  // Add newlines before major clauses
  for (const kw of NEWLINE_BEFORE) {
    const regex = new RegExp(`\\s+${kw}\\b`, 'g')
    result = result.replace(regex, `\n${kw}`)
  }

  // Indent lines after first
  const lines = result.split('\n')
  const formatted = lines.map((line, i) => {
    const trimmed = line.trim()
    if (i === 0) return trimmed
    // Sub-keywords get extra indent
    const isSubClause = ['AND', 'OR'].some((k) => trimmed.startsWith(k + ' ') || trimmed === k)
    return (isSubClause ? '    ' : '  ') + trimmed
  })

  return formatted.join('\n').trim()
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('sql-formatter')
if (!tool) throw new Error('[ToolEngine] sql-formatter not found in registry')

export const sqlFormatterConfig = defineToolConfig<string, string>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Paste SQL query to format and beautify...',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter SQL to format.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const result = formatSql(input)
    onProgress(100)
    return result
  },
  resultType: 'code',
  layoutMode: 'split',
})

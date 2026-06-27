/** UI theme preferences */
export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

/** T-shirt size scale used across Button, Badge, Icon, etc. */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/** Visual variant / intent scale */
export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'

/** Generic async operation status */
export type Status = 'idle' | 'loading' | 'success' | 'error'

/** Badge / tag semantic color */
export type Color = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

/** Single breadcrumb item used by layouts and SEO */
export interface BreadcrumbItem {
  label: string
  href?: string
  /** Whether this is the final (current) crumb */
  isCurrentPage?: boolean
}

/** Navigation link entry */
export interface NavItem {
  label: string
  href: string
  icon?: string
  /** Badge text — e.g. "New" */
  badge?: string
  /** Whether the link should open in a new tab */
  external?: boolean
  children?: NavItem[]
}

/** Option in a <select> or ComboBox */
export interface SelectOption<T = string> {
  label: string
  value: T
  description?: string
  disabled?: boolean
  icon?: string
}

/** Tabbed navigation item */
export interface TabItem {
  id: string
  label: string
  icon?: string
  disabled?: boolean
}

/** Generic key→value pair */
export interface KeyValuePair<V = string> {
  key: string
  value: V
}

/** Column definition for a data table */
export interface TableColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  width?: string
}

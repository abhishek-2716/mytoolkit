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

/** Option in a <select> or ComboBox */
export interface SelectOption<T = string> {
  label: string
  value: T
  description?: string
  disabled?: boolean
  icon?: string
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

/**
 * Tool Discovery — Public API
 */

// Components
export { CategoryCard } from './components/CategoryCard'
export { CategoryFilterTabs } from './components/CategoryFilterTabs'
export { CollectionSection } from './components/CollectionSection'
export type { ToolCardVariant } from './components/ToolCard'
export { ToolCard } from './components/ToolCard'
export { ToolCardSkeleton, ToolGridSkeleton } from './components/ToolCardSkeleton'
export { ToolGrid } from './components/ToolGrid'
export { ToolSearchBar } from './components/ToolSearchBar'
export { ToolsEmptyState } from './components/ToolsEmptyState'

// Hooks
export { useRecentSearches } from './hooks/useRecentSearches'
export type { SortOption } from './hooks/useToolSearch'
export { useToolSearch } from './hooks/useToolSearch'

// SEO
export { ActiveToolsPageSEO, CategoryPageSEO, SearchPageSEO,ToolsPageSEO } from './seo/DiscoverySEO'

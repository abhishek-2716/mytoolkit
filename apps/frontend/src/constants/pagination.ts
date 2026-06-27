/** Pagination defaults for every list view in the application */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,

  /** Tools grid — 3×4 or 4×3 grid layouts */
  TOOLS_PER_PAGE: 12,
  /** Blog listing — 3×3 grid */
  BLOG_PER_PAGE: 9,
  /** Search results — slightly more to reduce paging */
  SEARCH_PER_PAGE: 15,
  /** Category tool listing */
  CATEGORY_TOOLS_PER_PAGE: 12,
  /** Admin views */
  ADMIN_PER_PAGE: 20,

  /** Safety cap — never request more than this in one call */
  MAX_LIMIT: 100,
} as const

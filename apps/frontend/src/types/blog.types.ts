export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: BlogAuthor
  category: string
  tags: string[]
  featuredImage?: string
  /** Average reading time in minutes */
  readingTime: number
  publishedAt: string
  updatedAt: string
  isPublished: boolean
  /** Tool slugs related to this article */
  relatedTools?: string[]
  /** Blog post slugs for further reading */
  relatedPosts?: string[]
}

export interface BlogAuthor {
  id: string
  name: string
  avatar?: string
  bio?: string
  url?: string
}

export interface BlogCategory {
  id: string
  slug: string
  name: string
  description: string
  postCount: number
  icon?: string
}

export interface BlogListResponse {
  posts: BlogPost[]
  total: number
  page: number
  totalPages: number
}

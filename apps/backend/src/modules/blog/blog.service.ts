import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreatePostDto, UpdatePostDto, PostQueryDto } from './dto/post.dto'
import { paginate, paginatedResponse } from '../../common/pagination.dto'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  private postSelect = {
    id: true,
    title: true,
    slug: true,
    excerpt: true,
    coverImage: true,
    status: true,
    publishedAt: true,
    readingTime: true,
    viewCount: true,
    isFeatured: true,
    createdAt: true,
    updatedAt: true,
    author: { select: { id: true, name: true, slug: true, avatar: true } },
    categories: { select: { category: { select: { id: true, name: true, slug: true, color: true } } } },
    tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
    seoMeta: true,
  }

  async findAll(query: PostQueryDto) {
    const { page = 1, limit = 20, search, status, category, tag, author, featured } = query
    const { skip, take } = paginate(page, limit)

    const where: any = {}
    if (search) where.title = { contains: search }
    if (status) where.status = status
    if (featured !== undefined) where.isFeatured = featured
    if (category) where.categories = { some: { category: { slug: category } } }
    if (tag) where.tags = { some: { tag: { slug: tag } } }
    if (author) where.author = { slug: author }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: this.postSelect,
      }),
      this.prisma.post.count({ where }),
    ])

    return paginatedResponse(data, total, page, limit)
  }

  async findOne(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        seoMeta: true,
      },
    })
    if (!post) throw new NotFoundException(`Post '${slug}' not found`)
    return post
  }

  async create(dto: CreatePostDto) {
    const slug = dto.slug || generateSlug(dto.title)

    const existing = await this.prisma.post.findUnique({ where: { slug } })
    if (existing) throw new ConflictException(`Slug '${slug}' already exists`)

    const { categoryIds, tagIds, metaTitle, metaDescription, ogImage, ...postData } = dto

    return this.prisma.post.create({
      data: {
        ...postData,
        slug,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
        categories: categoryIds?.length
          ? { create: categoryIds.map((id) => ({ categoryId: id })) }
          : undefined,
        tags: tagIds?.length
          ? { create: tagIds.map((id) => ({ tagId: id })) }
          : undefined,
        seoMeta: (metaTitle || metaDescription || ogImage)
          ? { create: { metaTitle, metaDescription, ogImage } }
          : undefined,
      },
      include: { author: true, categories: true, tags: true, seoMeta: true },
    })
  }

  async update(id: string, dto: UpdatePostDto) {
    await this.findById(id)
    const { categoryIds, tagIds, metaTitle, metaDescription, ogImage, ...postData } = dto

    return this.prisma.$transaction(async (tx) => {
      if (categoryIds !== undefined) {
        await tx.postCategory.deleteMany({ where: { postId: id } })
        if (categoryIds.length) {
          await tx.postCategory.createMany({
            data: categoryIds.map((cid) => ({ postId: id, categoryId: cid })),
          })
        }
      }
      if (tagIds !== undefined) {
        await tx.postTag.deleteMany({ where: { postId: id } })
        if (tagIds.length) {
          await tx.postTag.createMany({
            data: tagIds.map((tid) => ({ postId: id, tagId: tid })),
          })
        }
      }

      const post = await tx.post.update({
        where: { id },
        data: {
          ...postData,
          publishedAt: postData.publishedAt ? new Date(postData.publishedAt) : undefined,
        },
        include: { author: true, categories: true, tags: true, seoMeta: true },
      })

      if (metaTitle !== undefined || metaDescription !== undefined || ogImage !== undefined) {
        await tx.seoMeta.upsert({
          where: { postId: id },
          create: { postId: id, metaTitle, metaDescription, ogImage },
          update: { metaTitle, metaDescription, ogImage },
        })
      }

      return post
    })
  }

  async remove(id: string) {
    await this.findById(id)
    await this.prisma.post.delete({ where: { id } })
    return { message: 'Post deleted' }
  }

  async incrementView(slug: string) {
    await this.prisma.post.updateMany({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    })
  }

  private async findById(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } })
    if (!post) throw new NotFoundException('Post not found')
    return post
  }
}

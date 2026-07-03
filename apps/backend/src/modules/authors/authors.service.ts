import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateAuthorDto, UpdateAuthorDto } from './dto/author.dto'
import { paginate, paginatedResponse } from '../../common/pagination.dto'

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const { skip, take } = paginate(page, limit)
    const [data, total] = await this.prisma.$transaction([
      this.prisma.author.findMany({ skip, take, orderBy: { name: 'asc' },
        include: { _count: { select: { posts: true } } } }),
      this.prisma.author.count(),
    ])
    return paginatedResponse(data, total, page, limit)
  }

  async findOne(slug: string) {
    const author = await this.prisma.author.findUnique({
      where: { slug },
      include: { posts: { select: { id: true, title: true, slug: true, status: true, publishedAt: true } } },
    })
    if (!author) throw new NotFoundException('Author not found')
    return author
  }

  async create(dto: CreateAuthorDto) {
    const slug = dto.slug || slugify(dto.name)
    const existing = await this.prisma.author.findUnique({ where: { slug } })
    if (existing) throw new ConflictException(`Slug '${slug}' already in use`)
    return this.prisma.author.create({ data: { ...dto, slug } })
  }

  async update(id: string, dto: UpdateAuthorDto) {
    await this.ensureExists(id)
    return this.prisma.author.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    await this.ensureExists(id)
    await this.prisma.author.delete({ where: { id } })
    return { message: 'Author deleted' }
  }

  private async ensureExists(id: string) {
    const a = await this.prisma.author.findUnique({ where: { id } })
    if (!a) throw new NotFoundException('Author not found')
  }
}

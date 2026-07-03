import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto'

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-') }

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { posts: true } } },
    })
  }

  async findOne(slug: string) {
    const c = await this.prisma.category.findUnique({ where: { slug }, include: { _count: { select: { posts: true } } } })
    if (!c) throw new NotFoundException('Category not found')
    return c
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug || slugify(dto.name)
    const exists = await this.prisma.category.findUnique({ where: { slug } })
    if (exists) throw new ConflictException('Slug already exists')
    return this.prisma.category.create({ data: { ...dto, slug } })
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.ensure(id)
    return this.prisma.category.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    await this.ensure(id)
    await this.prisma.category.delete({ where: { id } })
    return { message: 'Category deleted' }
  }

  private async ensure(id: string) {
    const c = await this.prisma.category.findUnique({ where: { id } })
    if (!c) throw new NotFoundException('Category not found')
  }
}

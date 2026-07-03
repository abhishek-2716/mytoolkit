import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { IsString, IsOptional, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateTagDto {
  @ApiProperty() @IsString() @MaxLength(100) name: string
  @ApiPropertyOptional() @IsOptional() @IsString() slug?: string
}
export class UpdateTagDto extends CreateTagDto {}

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-') }

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    })
  }

  async create(dto: CreateTagDto) {
    const slug = dto.slug || slugify(dto.name)
    const exists = await this.prisma.tag.findUnique({ where: { slug } })
    if (exists) throw new ConflictException('Tag slug already exists')
    return this.prisma.tag.create({ data: { ...dto, slug } })
  }

  async update(id: string, dto: UpdateTagDto) {
    await this.ensure(id)
    return this.prisma.tag.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    await this.ensure(id)
    await this.prisma.tag.delete({ where: { id } })
    return { message: 'Tag deleted' }
  }

  private async ensure(id: string) {
    const t = await this.prisma.tag.findUnique({ where: { id } })
    if (!t) throw new NotFoundException('Tag not found')
  }
}

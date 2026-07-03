import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateFaqDto {
  @ApiProperty() @IsString() question: string
  @ApiProperty() @IsString() answer: string
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string
  @ApiPropertyOptional() @IsOptional() @IsInt() @Type(() => Number) order?: number
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean
}
export class UpdateFaqDto extends CreateFaqDto {}

@Injectable()
export class FaqService {
  constructor(private prisma: PrismaService) {}

  findAll(category?: string) {
    return this.prisma.faq.findMany({
      where: { ...(category ? { category } : {}), isActive: true },
      orderBy: { order: 'asc' },
    })
  }

  findAllAdmin() {
    return this.prisma.faq.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] })
  }

  async create(dto: CreateFaqDto) {
    return this.prisma.faq.create({ data: dto })
  }

  async update(id: string, dto: UpdateFaqDto) {
    await this.ensure(id)
    return this.prisma.faq.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    await this.ensure(id)
    await this.prisma.faq.delete({ where: { id } })
    return { message: 'FAQ deleted' }
  }

  private async ensure(id: string) {
    const f = await this.prisma.faq.findUnique({ where: { id } })
    if (!f) throw new NotFoundException('FAQ not found')
  }
}

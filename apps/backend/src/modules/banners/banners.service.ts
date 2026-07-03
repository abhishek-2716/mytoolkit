import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { IsString, IsOptional, IsBoolean, IsInt, IsDateString } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateBannerDto {
  @ApiProperty() @IsString() title: string
  @ApiPropertyOptional() @IsOptional() @IsString() subtitle?: string
  @ApiPropertyOptional() @IsOptional() @IsString() badge?: string
  @ApiPropertyOptional() @IsOptional() @IsString() ctaText?: string
  @ApiPropertyOptional() @IsOptional() @IsString() ctaUrl?: string
  @ApiPropertyOptional() @IsOptional() @IsString() ctaSecondaryText?: string
  @ApiPropertyOptional() @IsOptional() @IsString() ctaSecondaryUrl?: string
  @ApiPropertyOptional() @IsOptional() @IsString() image?: string
  @ApiPropertyOptional() @IsOptional() @IsString() bgColor?: string
  @ApiPropertyOptional() @IsOptional() @IsString() placement?: string
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean
  @ApiPropertyOptional() @IsOptional() @IsDateString() startDate?: string
  @ApiPropertyOptional() @IsOptional() @IsDateString() endDate?: string
  @ApiPropertyOptional() @IsOptional() @IsInt() @Type(() => Number) order?: number
}
export class UpdateBannerDto extends CreateBannerDto {}

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  findAll(placement?: string) {
    return this.prisma.banner.findMany({
      where: placement ? { placement } : undefined,
      orderBy: { order: 'asc' },
    })
  }

  findActive(placement = 'hero') {
    const now = new Date()
    return this.prisma.banner.findMany({
      where: {
        placement,
        isActive: true,
        OR: [{ startDate: null }, { startDate: { lte: now } }],
        AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
      },
      orderBy: { order: 'asc' },
    })
  }

  async create(dto: CreateBannerDto) {
    return this.prisma.banner.create({ data: dto })
  }

  async update(id: string, dto: UpdateBannerDto) {
    await this.ensure(id)
    return this.prisma.banner.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    await this.ensure(id)
    await this.prisma.banner.delete({ where: { id } })
    return { message: 'Banner deleted' }
  }

  private async ensure(id: string) {
    const b = await this.prisma.banner.findUnique({ where: { id } })
    if (!b) throw new NotFoundException('Banner not found')
  }
}

import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { IsString, IsOptional, IsBoolean, IsInt, IsEnum, IsDateString } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { AdType } from '@prisma/client'

export class CreateAdDto {
  @ApiProperty() @IsString() name: string
  @ApiPropertyOptional({ enum: AdType }) @IsOptional() @IsEnum(AdType) type?: AdType
  @ApiProperty() @IsString() placement: string
  @ApiPropertyOptional() @IsOptional() @IsString() code?: string
  @ApiPropertyOptional() @IsOptional() @IsString() imageUrl?: string
  @ApiPropertyOptional() @IsOptional() @IsString() linkUrl?: string
  @ApiPropertyOptional() @IsOptional() @IsString() altText?: string
  @ApiPropertyOptional() @IsOptional() @IsInt() @Type(() => Number) width?: number
  @ApiPropertyOptional() @IsOptional() @IsInt() @Type(() => Number) height?: number
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean
  @ApiPropertyOptional() @IsOptional() @IsDateString() startDate?: string
  @ApiPropertyOptional() @IsOptional() @IsDateString() endDate?: string
}
export class UpdateAdDto extends CreateAdDto {}

@Injectable()
export class AdsService {
  constructor(private prisma: PrismaService) {}

  findAll(placement?: string) {
    return this.prisma.advertisement.findMany({
      where: placement ? { placement } : undefined,
      orderBy: { createdAt: 'desc' },
    })
  }

  findActive(placement: string) {
    const now = new Date()
    return this.prisma.advertisement.findMany({
      where: {
        placement,
        isActive: true,
        OR: [{ startDate: null }, { startDate: { lte: now } }],
        AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
      },
    })
  }

  async create(dto: CreateAdDto) {
    return this.prisma.advertisement.create({ data: dto })
  }

  async update(id: string, dto: UpdateAdDto) {
    await this.ensure(id)
    return this.prisma.advertisement.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    await this.ensure(id)
    await this.prisma.advertisement.delete({ where: { id } })
    return { message: 'Ad deleted' }
  }

  async trackImpression(id: string) {
    await this.prisma.advertisement.update({ where: { id }, data: { impressions: { increment: 1 } } })
  }

  async trackClick(id: string) {
    await this.prisma.advertisement.update({ where: { id }, data: { clicks: { increment: 1 } } })
  }

  private async ensure(id: string) {
    const a = await this.prisma.advertisement.findUnique({ where: { id } })
    if (!a) throw new NotFoundException('Ad not found')
  }
}

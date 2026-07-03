import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { IsString, IsOptional, IsBoolean, IsInt, IsDateString } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateSponsorDto {
  @ApiProperty() @IsString() company: string
  @ApiPropertyOptional() @IsOptional() @IsString() logoUrl?: string
  @ApiPropertyOptional() @IsOptional() @IsString() website?: string
  @ApiProperty() @IsString() placement: string
  @ApiPropertyOptional() @IsOptional() @IsString() tagline?: string
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string
  @ApiPropertyOptional() @IsOptional() @IsString() tier?: string
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean
  @ApiPropertyOptional() @IsOptional() @IsDateString() startDate?: string
  @ApiPropertyOptional() @IsOptional() @IsDateString() endDate?: string
  @ApiPropertyOptional() @IsOptional() @IsInt() @Type(() => Number) order?: number
}
export class UpdateSponsorDto extends CreateSponsorDto {}

@Injectable()
export class SponsorsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.sponsorship.findMany({ orderBy: [{ tier: 'asc' }, { order: 'asc' }] })
  }

  findActive(placement?: string) {
    const now = new Date()
    return this.prisma.sponsorship.findMany({
      where: {
        isActive: true,
        ...(placement ? { placement } : {}),
        OR: [{ startDate: null }, { startDate: { lte: now } }],
        AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
      },
      orderBy: [{ tier: 'asc' }, { order: 'asc' }],
    })
  }

  async create(dto: CreateSponsorDto) {
    return this.prisma.sponsorship.create({ data: dto })
  }

  async update(id: string, dto: UpdateSponsorDto) {
    await this.ensure(id)
    return this.prisma.sponsorship.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    await this.ensure(id)
    await this.prisma.sponsorship.delete({ where: { id } })
    return { message: 'Sponsor deleted' }
  }

  private async ensure(id: string) {
    const s = await this.prisma.sponsorship.findUnique({ where: { id } })
    if (!s) throw new NotFoundException('Sponsor not found')
  }
}

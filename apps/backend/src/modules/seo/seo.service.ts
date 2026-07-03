import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { IsString, IsOptional, IsBoolean } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpsertSeoDto {
  @ApiPropertyOptional() @IsOptional() @IsString() entityType?: string
  @ApiPropertyOptional() @IsOptional() @IsString() entitySlug?: string
  @ApiPropertyOptional() @IsOptional() @IsString() metaTitle?: string
  @ApiPropertyOptional() @IsOptional() @IsString() metaDescription?: string
  @ApiPropertyOptional() @IsOptional() @IsString() ogTitle?: string
  @ApiPropertyOptional() @IsOptional() @IsString() ogDescription?: string
  @ApiPropertyOptional() @IsOptional() @IsString() ogImage?: string
  @ApiPropertyOptional() @IsOptional() @IsString() canonicalUrl?: string
  @ApiPropertyOptional() @IsOptional() @IsBoolean() noIndex?: boolean
  @ApiPropertyOptional() @IsOptional() structuredData?: any
}

@Injectable()
export class SeoService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.seoMeta.findMany({ orderBy: { updatedAt: 'desc' } })
  }

  findByEntity(type: string, slug: string) {
    return this.prisma.seoMeta.findFirst({ where: { entityType: type, entitySlug: slug } })
  }

  upsert(dto: UpsertSeoDto) {
    const { entityType, entitySlug, ...data } = dto
    return this.prisma.seoMeta.upsert({
      where: { id: `${entityType}_${entitySlug}` },
      create: { id: `${entityType}_${entitySlug}`, entityType, entitySlug, ...data },
      update: { ...data },
    })
  }

  remove(id: string) {
    return this.prisma.seoMeta.delete({ where: { id } })
  }
}

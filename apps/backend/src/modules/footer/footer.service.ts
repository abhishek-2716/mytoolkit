import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateFooterLinkDto {
  @ApiProperty() @IsString() label: string
  @ApiProperty() @IsString() url: string
  @ApiProperty() @IsString() section: string
  @ApiPropertyOptional() @IsOptional() @IsString() icon?: string
  @ApiPropertyOptional() @IsOptional() @IsInt() @Type(() => Number) order?: number
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isExternal?: boolean
}
export class UpdateFooterLinkDto extends CreateFooterLinkDto {}

@Injectable()
export class FooterService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.footerLink.findMany({ orderBy: [{ section: 'asc' }, { order: 'asc' }] })
  }

  findActive() {
    return this.prisma.footerLink.findMany({
      where: { isActive: true },
      orderBy: [{ section: 'asc' }, { order: 'asc' }],
    })
  }

  async create(dto: CreateFooterLinkDto) {
    return this.prisma.footerLink.create({ data: dto })
  }

  async update(id: string, dto: UpdateFooterLinkDto) {
    await this.ensure(id)
    return this.prisma.footerLink.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    await this.ensure(id)
    await this.prisma.footerLink.delete({ where: { id } })
    return { message: 'Footer link deleted' }
  }

  private async ensure(id: string) {
    const l = await this.prisma.footerLink.findUnique({ where: { id } })
    if (!l) throw new NotFoundException('Footer link not found')
  }
}

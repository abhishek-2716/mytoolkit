import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { IsString, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateAboutDto {
  @ApiPropertyOptional() @IsOptional() @IsString() heroTitle?: string
  @ApiPropertyOptional() @IsOptional() @IsString() heroSubtext?: string
  @ApiPropertyOptional() @IsOptional() @IsString() mission?: string
  @ApiPropertyOptional() @IsOptional() @IsString() vision?: string
  @ApiPropertyOptional() @IsOptional() stats?: any
  @ApiPropertyOptional() @IsOptional() teamMembers?: any
  @ApiPropertyOptional() @IsOptional() values?: any
}

const ABOUT_ID = 'singleton'

@Injectable()
export class AboutService {
  constructor(private prisma: PrismaService) {}

  async findOne() {
    return this.prisma.aboutPage.findFirst()
  }

  async upsert(dto: UpdateAboutDto) {
    return this.prisma.aboutPage.upsert({
      where: { id: ABOUT_ID },
      create: { id: ABOUT_ID, heroTitle: dto.heroTitle || 'About Us', ...dto },
      update: dto,
    })
  }
}

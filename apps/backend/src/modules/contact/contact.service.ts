import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { IsString, IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { MessageStatus } from '@prisma/client'

export class CreateContactDto {
  @ApiProperty() @IsString() @MinLength(2) @MaxLength(100) name: string
  @ApiProperty() @IsEmail() email: string
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(255) subject?: string
  @ApiProperty() @IsString() @MinLength(10) @MaxLength(5000) message: string
}

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContactDto, ip?: string, userAgent?: string) {
    return this.prisma.contactMessage.create({ data: { ...dto, ipAddress: ip, userAgent } })
  }

  async findAll(status?: MessageStatus, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [data, total] = await this.prisma.$transaction([
      this.prisma.contactMessage.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.contactMessage.count({ where: status ? { status } : undefined }),
    ])
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async updateStatus(id: string, status: MessageStatus) {
    return this.prisma.contactMessage.update({ where: { id }, data: { status } })
  }

  async remove(id: string) {
    await this.prisma.contactMessage.delete({ where: { id } })
    return { message: 'Message deleted' }
  }

  async getStats() {
    const [total, unread, read] = await this.prisma.$transaction([
      this.prisma.contactMessage.count(),
      this.prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
      this.prisma.contactMessage.count({ where: { status: 'READ' } }),
    ])
    return { total, unread, read }
  }
}

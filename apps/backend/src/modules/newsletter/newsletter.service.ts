import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { SubscriberStatus } from '@prisma/client'
import { randomBytes } from 'crypto'

export class SubscribeDto {
  @ApiProperty() @IsEmail() email: string
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string
}

export class UpdateSubscriberDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string
  @ApiPropertyOptional({ enum: SubscriberStatus }) @IsOptional() @IsEnum(SubscriberStatus) status?: SubscriberStatus
}

@Injectable()
export class NewsletterService {
  constructor(private prisma: PrismaService) {}

  async subscribe(dto: SubscribeDto) {
    const exists = await this.prisma.newsletterSubscriber.findUnique({ where: { email: dto.email } })
    if (exists && exists.status === 'ACTIVE') throw new ConflictException('Already subscribed')

    const unsubToken = randomBytes(16).toString('hex')
    return this.prisma.newsletterSubscriber.upsert({
      where: { email: dto.email },
      create: {
        ...dto,
        status: 'ACTIVE',
        confirmedAt: new Date(),
        unsubToken,
      },
      update: { status: 'ACTIVE', confirmedAt: new Date(), unsubToken },
    })
  }

  async unsubscribe(token: string) {
    const sub = await this.prisma.newsletterSubscriber.findFirst({ where: { unsubToken: token } })
    if (!sub) throw new NotFoundException('Subscription not found')
    await this.prisma.newsletterSubscriber.update({
      where: { id: sub.id },
      data: { status: 'UNSUBSCRIBED', unsubscribedAt: new Date() },
    })
    return { message: 'Unsubscribed successfully' }
  }

  async findAll(status?: SubscriberStatus, page = 1, limit = 50) {
    const skip = (page - 1) * limit
    const [data, total] = await this.prisma.$transaction([
      this.prisma.newsletterSubscriber.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.newsletterSubscriber.count({ where: status ? { status } : undefined }),
    ])
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async getStats() {
    const [total, active, unsubscribed] = await this.prisma.$transaction([
      this.prisma.newsletterSubscriber.count(),
      this.prisma.newsletterSubscriber.count({ where: { status: 'ACTIVE' } }),
      this.prisma.newsletterSubscriber.count({ where: { status: 'UNSUBSCRIBED' } }),
    ])
    return { total, active, unsubscribed }
  }

  async remove(id: string) {
    await this.prisma.newsletterSubscriber.delete({ where: { id } })
    return { message: 'Subscriber deleted' }
  }
}

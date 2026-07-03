import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { IsString, IsOptional } from 'class-validator'
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger'

export class TrackPageViewDto {
  @ApiProperty() @IsString() path: string
  @ApiPropertyOptional() @IsOptional() @IsString() referrer?: string
  @ApiPropertyOptional() @IsOptional() @IsString() sessionId?: string
}

export class TrackToolUsageDto {
  @ApiProperty() @IsString() toolSlug: string
  @ApiProperty() @IsString() action: string
  @ApiPropertyOptional() @IsOptional() @IsString() sessionId?: string
}

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async trackPageView(dto: TrackPageViewDto, ip?: string, userAgent?: string) {
    const device = userAgent
      ? /mobile/i.test(userAgent) ? 'mobile' : /tablet/i.test(userAgent) ? 'tablet' : 'desktop'
      : undefined

    return this.prisma.pageView.create({
      data: { ...dto, userAgent, device },
    })
  }

  async trackToolUsage(dto: TrackToolUsageDto) {
    return this.prisma.toolUsage.create({ data: dto })
  }

  async getDashboard() {
    const now = new Date()
    const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const last7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [
      totalPageViews,
      pageViews30d,
      pageViews7d,
      topPages,
      topTools,
      deviceBreakdown,
      dailyViews,
    ] = await this.prisma.$transaction([
      this.prisma.pageView.count(),
      this.prisma.pageView.count({ where: { createdAt: { gte: last30 } } }),
      this.prisma.pageView.count({ where: { createdAt: { gte: last7 } } }),
      this.prisma.pageView.groupBy({
        by: ['path'],
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 10,
        where: { createdAt: { gte: last30 } },
      }),
      this.prisma.toolUsage.groupBy({
        by: ['toolSlug'],
        _count: { toolSlug: true },
        orderBy: { _count: { toolSlug: 'desc' } },
        take: 10,
        where: { createdAt: { gte: last30 } },
      }),
      this.prisma.pageView.groupBy({
        by: ['device'],
        _count: { device: true },
        where: { createdAt: { gte: last30 } },
      }),
      this.prisma.$queryRaw`
        SELECT DATE(createdAt) as date, COUNT(*) as count
        FROM page_views
        WHERE createdAt >= ${last30}
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `,
    ])

    return {
      summary: { totalPageViews, pageViews30d, pageViews7d },
      topPages: topPages.map(p => ({ path: p.path, views: p._count.path })),
      topTools: topTools.map(t => ({ slug: t.toolSlug, uses: t._count.toolSlug })),
      deviceBreakdown: deviceBreakdown.map(d => ({ device: d.device, count: d._count.device })),
      dailyViews,
    }
  }

  async getToolStats(slug: string, days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    return this.prisma.toolUsage.groupBy({
      by: ['action'],
      _count: { action: true },
      where: { toolSlug: slug, createdAt: { gte: since } },
    })
  }
}

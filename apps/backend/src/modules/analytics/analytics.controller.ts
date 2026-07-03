import { Controller, Get, Post, Body, Param, Query, Request, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AnalyticsService, TrackPageViewDto, TrackToolUsageDto } from './analytics.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Public } from '../decorators/public.decorator'

@ApiTags('Analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private svc: AnalyticsService) {}

  @Public()
  @Post('pageview')
  @HttpCode(HttpStatus.NO_CONTENT)
  trackPageView(@Body() dto: TrackPageViewDto, @Request() req: any) {
    return this.svc.trackPageView(dto, req.ip, req.headers?.['user-agent'])
  }

  @Public()
  @Post('tool')
  @HttpCode(HttpStatus.NO_CONTENT)
  trackTool(@Body() dto: TrackToolUsageDto) {
    return this.svc.trackToolUsage(dto)
  }

  @Get('dashboard')
  getDashboard() { return this.svc.getDashboard() }

  @Get('tools/:slug')
  getToolStats(@Param('slug') slug: string, @Query('days') days?: number) {
    return this.svc.getToolStats(slug, days)
  }
}

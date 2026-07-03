import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { NewsletterService, SubscribeDto } from './newsletter.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Public } from '../decorators/public.decorator'
import { SubscriberStatus } from '@prisma/client'

@ApiTags('Newsletter')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('newsletter')
export class NewsletterController {
  constructor(private svc: NewsletterService) {}

  @Public()
  @Post('subscribe')
  subscribe(@Body() dto: SubscribeDto) { return this.svc.subscribe(dto) }

  @Public()
  @Get('unsubscribe/:token')
  unsubscribe(@Param('token') token: string) { return this.svc.unsubscribe(token) }

  @Get() findAll(@Query('status') status?: SubscriberStatus, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.svc.findAll(status, page, limit)
  }

  @Get('stats') getStats() { return this.svc.getStats() }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id) }
}

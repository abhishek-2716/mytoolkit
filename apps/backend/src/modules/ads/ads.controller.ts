import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AdsService, CreateAdDto, UpdateAdDto } from './ads.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Public } from '../decorators/public.decorator'

@ApiTags('Advertisements')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('ads')
export class AdsController {
  constructor(private svc: AdsService) {}

  @Get() findAll(@Query('placement') placement?: string) { return this.svc.findAll(placement) }

  @Public()
  @Get('active')
  findActive(@Query('placement') placement: string) { return this.svc.findActive(placement) }

  @Public()
  @Post(':id/impression')
  @HttpCode(HttpStatus.NO_CONTENT)
  trackImpression(@Param('id') id: string) { return this.svc.trackImpression(id) }

  @Public()
  @Post(':id/click')
  @HttpCode(HttpStatus.NO_CONTENT)
  trackClick(@Param('id') id: string) { return this.svc.trackClick(id) }

  @Post() create(@Body() dto: CreateAdDto) { return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateAdDto) { return this.svc.update(id, dto) }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id) }
}

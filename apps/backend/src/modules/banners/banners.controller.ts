import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { BannersService, CreateBannerDto, UpdateBannerDto } from './banners.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Public } from '../decorators/public.decorator'

@ApiTags('Banners')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('banners')
export class BannersController {
  constructor(private svc: BannersService) {}

  @Get() findAll(@Query('placement') placement?: string) { return this.svc.findAll(placement) }

  @Public()
  @Get('active')
  findActive(@Query('placement') placement?: string) { return this.svc.findActive(placement) }

  @Post() create(@Body() dto: CreateBannerDto) { return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateBannerDto) { return this.svc.update(id, dto) }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id) }
}

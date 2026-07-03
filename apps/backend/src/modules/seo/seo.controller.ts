import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { SeoService, UpsertSeoDto } from './seo.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Public } from '../decorators/public.decorator'

@ApiTags('SEO')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('seo')
export class SeoController {
  constructor(private svc: SeoService) {}

  @Get() findAll() { return this.svc.findAll() }

  @Public()
  @Get('entity')
  findByEntity(@Query('type') type: string, @Query('slug') slug: string) {
    return this.svc.findByEntity(type, slug)
  }

  @Post() upsert(@Body() dto: UpsertSeoDto) { return this.svc.upsert(dto) }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id) }
}

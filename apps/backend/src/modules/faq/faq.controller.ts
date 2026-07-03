import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { FaqService, CreateFaqDto, UpdateFaqDto } from './faq.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Public } from '../decorators/public.decorator'

@ApiTags('FAQ')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('faq')
export class FaqController {
  constructor(private svc: FaqService) {}

  @Public() @Get() findAll(@Query('category') category?: string) { return this.svc.findAll(category) }
  @Get('admin') findAllAdmin() { return this.svc.findAllAdmin() }
  @Post() create(@Body() dto: CreateFaqDto) { return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateFaqDto) { return this.svc.update(id, dto) }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id) }
}

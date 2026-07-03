import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { FooterService, CreateFooterLinkDto, UpdateFooterLinkDto } from './footer.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Public } from '../decorators/public.decorator'

@ApiTags('Footer')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('footer')
export class FooterController {
  constructor(private svc: FooterService) {}

  @Get() findAll() { return this.svc.findAll() }
  @Public() @Get('active') findActive() { return this.svc.findActive() }
  @Post() create(@Body() dto: CreateFooterLinkDto) { return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateFooterLinkDto) { return this.svc.update(id, dto) }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id) }
}

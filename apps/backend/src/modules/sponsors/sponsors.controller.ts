import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { SponsorsService, CreateSponsorDto, UpdateSponsorDto } from './sponsors.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Public } from '../decorators/public.decorator'

@ApiTags('Sponsors')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('sponsors')
export class SponsorsController {
  constructor(private svc: SponsorsService) {}

  @Get() findAll() { return this.svc.findAll() }
  @Public() @Get('active') findActive(@Query('placement') p?: string) { return this.svc.findActive(p) }
  @Post() create(@Body() dto: CreateSponsorDto) { return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateSponsorDto) { return this.svc.update(id, dto) }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id) }
}

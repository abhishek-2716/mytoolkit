import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AboutService, UpdateAboutDto } from './about.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Public } from '../decorators/public.decorator'

@ApiTags('About')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('about')
export class AboutController {
  constructor(private svc: AboutService) {}

  @Public() @Get() findOne() { return this.svc.findOne() }
  @Put() upsert(@Body() dto: UpdateAboutDto) { return this.svc.upsert(dto) }
}

import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { ContactService, CreateContactDto } from './contact.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Public } from '../decorators/public.decorator'
import { MessageStatus } from '@prisma/client'

@ApiTags('Contact')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('contact')
export class ContactController {
  constructor(private svc: ContactService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateContactDto, @Request() req: any) {
    return this.svc.create(dto, req.ip, req.headers?.['user-agent'])
  }

  @Get() findAll(@Query('status') status?: MessageStatus, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.svc.findAll(status, page, limit)
  }

  @Get('stats') getStats() { return this.svc.getStats() }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: MessageStatus) {
    return this.svc.updateStatus(id, status)
  }

  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id) }
}

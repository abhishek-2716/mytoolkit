import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { TagsService, CreateTagDto, UpdateTagDto } from './tags.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Public } from '../decorators/public.decorator'

@ApiTags('Tags')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('tags')
export class TagsController {
  constructor(private svc: TagsService) {}

  @Public() @Get() findAll() { return this.svc.findAll() }
  @Post() create(@Body() dto: CreateTagDto) { return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateTagDto) { return this.svc.update(id, dto) }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id) }
}

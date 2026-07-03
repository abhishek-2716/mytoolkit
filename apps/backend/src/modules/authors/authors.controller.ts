import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { AuthorsService } from './authors.service'
import { CreateAuthorDto, UpdateAuthorDto } from './dto/author.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Public } from '../decorators/public.decorator'

@ApiTags('Authors')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('authors')
export class AuthorsController {
  constructor(private svc: AuthorsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List authors (public)' })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.svc.findAll(page, limit)
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.svc.findOne(slug)
  }

  @Post()
  @ApiOperation({ summary: '[Admin] Create author' })
  create(@Body() dto: CreateAuthorDto) {
    return this.svc.create(dto)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAuthorDto) {
    return this.svc.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id)
  }
}

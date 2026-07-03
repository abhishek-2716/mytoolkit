import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Public } from '../decorators/public.decorator'

@ApiTags('Categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private svc: CategoriesService) {}

  @Public() @Get() findAll() { return this.svc.findAll() }
  @Public() @Get(':slug') findOne(@Param('slug') slug: string) { return this.svc.findOne(slug) }
  @Post() create(@Body() dto: CreateCategoryDto) { return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) { return this.svc.update(id, dto) }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id) }
}

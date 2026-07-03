import {
  Controller, Get, Post, Put, Delete, Body,
  Param, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { BlogService } from './blog.service'
import { CreatePostDto, UpdatePostDto, PostQueryDto } from './dto/post.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Public } from '../decorators/public.decorator'

@ApiTags('Blog')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  // ── Public endpoints ──────────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'List published posts (public)' })
  findAll(@Query() query: PostQueryDto) {
    return this.blogService.findAll(query)
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get post by slug (public)' })
  findOne(@Param('slug') slug: string) {
    return this.blogService.findOne(slug)
  }

  @Public()
  @Post(':slug/view')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Increment post view count' })
  incrementView(@Param('slug') slug: string) {
    return this.blogService.incrementView(slug)
  }

  // ── Admin endpoints ───────────────────────────────────────────────────────

  @Post()
  @ApiOperation({ summary: '[Admin] Create post' })
  create(@Body() dto: CreatePostDto) {
    return this.blogService.create(dto)
  }

  @Put(':id')
  @ApiOperation({ summary: '[Admin] Update post' })
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.blogService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete post' })
  remove(@Param('id') id: string) {
    return this.blogService.remove(id)
  }
}

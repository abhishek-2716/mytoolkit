import {
  IsString, IsOptional, IsEnum, IsBoolean,
  IsArray, MaxLength, MinLength, IsDateString, IsInt, Min,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PostStatus } from '@prisma/client'
import { Type } from 'class-transformer'

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  excerpt?: string

  @ApiProperty()
  @IsString()
  content: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImage?: string

  @ApiPropertyOptional({ enum: PostStatus, default: 'DRAFT' })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  publishedAt?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  readingTime?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean

  @ApiProperty()
  @IsString()
  authorId: string

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[]

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[]

  // Inline SEO
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaTitle?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaDescription?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ogImage?: string
}

export class UpdatePostDto extends CreatePostDto {}

export class PostQueryDto {
  @IsOptional()
  @Type(() => Number)
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  limit?: number = 20

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsString()
  tag?: string

  @IsOptional()
  @IsString()
  author?: string

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  featured?: boolean
}

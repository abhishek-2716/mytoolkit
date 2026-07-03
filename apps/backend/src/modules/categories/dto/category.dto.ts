import { IsString, IsOptional, IsBoolean, IsInt, MaxLength } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  name: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  color?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  order?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}

export class UpdateCategoryDto extends CreateCategoryDto {}

import { IsString, IsOptional, IsBoolean, MaxLength, MinLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateAuthorDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  twitter?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  linkedin?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  website?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}

export class UpdateAuthorDto extends CreateAuthorDto {}

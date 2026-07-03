import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { IsString, IsEmail, IsOptional, IsEnum, MinLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import * as bcrypt from 'bcrypt'

export class CreateUserDto {
  @ApiProperty() @IsEmail() email: string
  @ApiProperty() @IsString() @MinLength(8) password: string
  @ApiProperty() @IsString() name: string
  @ApiPropertyOptional({ enum: Role }) @IsOptional() @IsEnum(Role) role?: Role
}

export class UpdateUserDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string
  @ApiPropertyOptional() @IsOptional() @IsString() avatar?: string
  @ApiPropertyOptional({ enum: Role }) @IsOptional() @IsEnum(Role) role?: Role
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, avatar: true, isActive: true, lastLoginAt: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: string) {
    const u = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, avatar: true, isActive: true, createdAt: true },
    })
    if (!u) throw new NotFoundException('User not found')
    return u
  }

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (exists) throw new ConflictException('Email already registered')
    const hashed = await bcrypt.hash(dto.password, 12)
    return this.prisma.user.create({
      data: { ...dto, password: hashed },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    })
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id)
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, email: true, name: true, role: true, avatar: true },
    })
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.prisma.user.delete({ where: { id } })
    return { message: 'User deleted' }
  }
}

import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { UsersService, CreateUserDto, UpdateUserDto } from './users.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private svc: UsersService) {}

  @Get() findAll() { return this.svc.findAll() }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(id) }
  @Post() create(@Body() dto: CreateUserDto) { return this.svc.create(dto) }
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateUserDto) { return this.svc.update(id, dto) }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id) }
}

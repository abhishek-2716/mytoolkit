import { IsEmail, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ example: 'admin@mytoolshub.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'Admin@1212' })
  @IsString()
  @MinLength(6)
  password: string
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string
}

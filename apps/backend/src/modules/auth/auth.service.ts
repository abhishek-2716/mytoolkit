import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials')

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    return user
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password)

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    const payload = { sub: user.id, email: user.email, role: user.role }

    return {
      accessToken: this.jwt.sign(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRES_IN', '7d'),
      }),
      refreshToken: this.jwt.sign(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '30d'),
      }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    }
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      })
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } })
      if (!user || !user.isActive) throw new UnauthorizedException()

      const newPayload = { sub: user.id, email: user.email, role: user.role }
      return {
        accessToken: this.jwt.sign(newPayload, {
          secret: this.config.get('JWT_SECRET'),
          expiresIn: this.config.get('JWT_EXPIRES_IN', '7d'),
        }),
      }
    } catch {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, avatar: true, lastLoginAt: true, createdAt: true },
    })
    if (!user) throw new UnauthorizedException()
    return user
  }
}

import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: process.env.NODE_ENV === 'development' }),
  )

  const config = app.get(ConfigService)
  const port = config.get<number>('PORT', 3001)
  const prefix = config.get<string>('API_PREFIX', 'api')
  const frontendUrl = config.get<string>('FRONTEND_URL', 'http://localhost:5173')

  // ── Security ──────────────────────────────────────────────────────────────
  await app.register(require('@fastify/helmet'), {
    contentSecurityPolicy: false,
  })
  await app.register(require('@fastify/cors'), {
    origin: [frontendUrl, 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })

  // ── Global prefix & versioning ────────────────────────────────────────────
  app.setGlobalPrefix(prefix)
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })

  // ── Validation ────────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  // ── Swagger (dev only) ────────────────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('MyToolsHub API')
      .setDescription('Backend API for MyToolsHub admin and public endpoints')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    })
    console.log(`📚  Swagger docs: http://localhost:${port}/docs`)
  }

  await app.listen(port, '0.0.0.0')
  console.log(`🚀  API running on http://localhost:${port}/${prefix}/v1`)
}

bootstrap()

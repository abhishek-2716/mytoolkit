import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { BlogModule } from './modules/blog/blog.module'
import { AuthorsModule } from './modules/authors/authors.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { TagsModule } from './modules/tags/tags.module'
import { SeoModule } from './modules/seo/seo.module'
import { BannersModule } from './modules/banners/banners.module'
import { FooterModule } from './modules/footer/footer.module'
import { AboutModule } from './modules/about/about.module'
import { FaqModule } from './modules/faq/faq.module'
import { AdsModule } from './modules/ads/ads.module'
import { SponsorsModule } from './modules/sponsors/sponsors.module'
import { AnalyticsModule } from './modules/analytics/analytics.module'
import { NewsletterModule } from './modules/newsletter/newsletter.module'
import { ContactModule } from './modules/contact/contact.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    AuthModule,
    UsersModule,
    BlogModule,
    AuthorsModule,
    CategoriesModule,
    TagsModule,
    SeoModule,
    BannersModule,
    FooterModule,
    AboutModule,
    FaqModule,
    AdsModule,
    SponsorsModule,
    AnalyticsModule,
    NewsletterModule,
    ContactModule,
  ],
})
export class AppModule {}

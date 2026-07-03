import { Module } from '@nestjs/common'
import { FooterService } from './footer.service'
import { FooterController } from './footer.controller'

@Module({ providers: [FooterService], controllers: [FooterController] })
export class FooterModule {}

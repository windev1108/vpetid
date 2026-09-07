import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MailService } from './mail.service';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

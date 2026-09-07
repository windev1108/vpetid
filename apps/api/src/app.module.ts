import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PetsModule } from './modules/pets/pets.module';
import { PublicModule } from './modules/public/public.module';
import { ProfileModule } from './modules/profile/profile.module';
import { MailModule } from './modules/mail/mail.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    PetsModule,
    PublicModule,
    ProfileModule,
    MailModule,
    HealthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

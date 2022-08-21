import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MfaModule } from './mfa/mfa.module';

@Module({
  imports: [MfaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

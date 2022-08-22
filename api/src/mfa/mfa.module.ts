import { Module } from '@nestjs/common';
import { MfaTokenService } from './mfa-token.service';
import { MfaController } from './mfa.controller';
import { MfaService } from './mfa.service';

@Module({
  controllers: [MfaController],
  providers: [MfaService, MfaTokenService],
})
export class MfaModule {}

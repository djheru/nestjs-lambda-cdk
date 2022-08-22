import { Body, Controller, Post } from '@nestjs/common';
import { RegisterMfaUserDto } from './dto/register-mfa-user.dto';
import { VerifyMfaDto } from './dto/verify-mfa.dto';
import { MfaService } from './mfa.service';

@Controller('mfa')
export class MfaController {
  constructor(private readonly mfaService: MfaService) {}

  @Post('register')
  register(@Body() registerMfaUserDto: RegisterMfaUserDto) {
    return this.mfaService.register(registerMfaUserDto);
  }

  @Post('verify')
  verify(@Body() verifyMfaDto: VerifyMfaDto) {
    return this.mfaService.verify(verifyMfaDto);
  }
}

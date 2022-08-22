import { Injectable } from '@nestjs/common';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import { RegisterMfaUserDto } from './dto/register-mfa-user.dto';
import { VerifyMfaDto } from './dto/verify-mfa.dto';
import { MfaUser } from './entities/mfa-user.entity';
import { MfaTokenService } from './mfa-token.service';

@Injectable()
export class MfaService {
  constructor(
    private readonly tokenService: MfaTokenService,
    @InjectTwilio() private readonly twilioClient: TwilioClient
  ) {}

  async register(registerMfaUserDto: RegisterMfaUserDto) {
    const { userId: id, identifier, identifierType } = registerMfaUserDto;
    const secret = this.tokenService.createSecret();
    const mfaUser = {
      id,
      secret,
      identifier,
      identifierType,
      date_added: new Date().toISOString(),
    };
    await MfaUser.put(mfaUser);

    const token = this.tokenService.generateToken(secret);

    console.log({ token });
    const response = await this.twilioClient.messages.create({
      body: `MFA Verification Code: ${token}`,
      from: '+12136422215',
      to: '+14806166180',
    });

    console.log(response);

    return { token };
  }

  async verify(verifyMfaDto: VerifyMfaDto) {
    const { identifier, identifierType, token, userId: id } = verifyMfaDto;
    const { Item: user } = await MfaUser.get({
      id,
      identifierType,
      identifier,
    });
    console.log(user);
    console.log(token);
    const verified = this.tokenService.verifyToken(token, user.secret);
    console.log(verified);
  }
}

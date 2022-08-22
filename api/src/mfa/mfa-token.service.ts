import { Injectable } from '@nestjs/common';
import speakeasy from 'speakeasy';

@Injectable()
export class MfaTokenService {
  createSecret() {
    const secret = speakeasy.generateSecret();
    console.log(secret);
    return secret.base32;
  }

  generateToken(secret: string) {
    const token = speakeasy.totp({ secret, encoding: 'base32' });
    return token;
  }

  verifyToken(token: string, secret: string) {
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
    });
    return verified;
  }
}

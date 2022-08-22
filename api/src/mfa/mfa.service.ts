import { Injectable } from '@nestjs/common';
import speakeasy from 'speakeasy';
import { CreateMfaDto } from './dto/create-mfa.dto';
import { RegisterMfaUserDto } from './dto/register-mfa-user.dto';
import { UpdateMfaDto } from './dto/update-mfa.dto';
import { VerifyMfaDto } from './dto/verify-mfa.dto';
import { MfaUser } from './entities/mfa-user.entity';

@Injectable()
export class MfaService {
  async register(registerMfaUserDto: RegisterMfaUserDto) {
    const { userId: id, identifier, identifierType } = registerMfaUserDto;
    const secret = this.createSecret();
    const mfaUser = {
      id,
      secret,
      identifier,
      identifierType,
      date_added: new Date().toISOString(),
    };
    await MfaUser.put(mfaUser);

    const token = this.generateToken(secret);

    console.log({ token });

    // const verified = this.verifyToken(token, secret);
    // console.log({ verified });

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
    const verified = this.verifyToken(token, user.secret);
    console.log(verified);
  }

  create(createMfaDto: CreateMfaDto) {
    return 'This action adds a new mfa';
  }

  findAll() {
    return `This action returns all mfa`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mfa`;
  }

  update(id: number, updateMfaDto: UpdateMfaDto) {
    return `This action updates a #${id} mfa`;
  }

  remove(id: number) {
    return `This action removes a #${id} mfa`;
  }

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

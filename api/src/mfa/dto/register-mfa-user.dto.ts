import { OmitType } from '@nestjs/mapped-types';
import { VerifyMfaDto } from './verify-mfa.dto';

export class RegisterMfaUserDto extends OmitType(VerifyMfaDto, ['token'] as const) {}

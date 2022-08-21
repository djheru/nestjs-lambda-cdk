import { PartialType } from '@nestjs/mapped-types';
import { CreateMfaDto } from './create-mfa.dto';

export class UpdateMfaDto extends PartialType(CreateMfaDto) {}

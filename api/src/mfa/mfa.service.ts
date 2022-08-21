import { Injectable } from '@nestjs/common';
import { CreateMfaDto } from './dto/create-mfa.dto';
import { UpdateMfaDto } from './dto/update-mfa.dto';

@Injectable()
export class MfaService {
  register() {
    return 'This action registers a new mfa user';
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
}

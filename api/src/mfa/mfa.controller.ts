import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MfaService } from './mfa.service';
import { CreateMfaDto } from './dto/create-mfa.dto';
import { UpdateMfaDto } from './dto/update-mfa.dto';
import { RegisterMfaUserDto } from './dto/register-mfa-user.dto';

@Controller('mfa')
export class MfaController {
  constructor(private readonly mfaService: MfaService) {}

  @Post()
  register(@Body() registerMfaUserDto: RegisterMfaUserDto) {
    return this.mfaService.register();
  }

  @Post()
  create(@Body() createMfaDto: CreateMfaDto) {
    return this.mfaService.create(createMfaDto);
  }

  @Get()
  findAll() {
    return this.mfaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mfaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMfaDto: UpdateMfaDto) {
    return this.mfaService.update(+id, updateMfaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mfaService.remove(+id);
  }
}

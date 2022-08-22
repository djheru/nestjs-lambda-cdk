import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateMfaDto } from './dto/create-mfa.dto';
import { RegisterMfaUserDto } from './dto/register-mfa-user.dto';
import { UpdateMfaDto } from './dto/update-mfa.dto';
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

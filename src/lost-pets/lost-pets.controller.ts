import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LostPetsService } from './lost-pets.service';
import { CreateLostPetDto } from 'src/core/interfaces/lost_pet.interface';
 
@Controller('lost-pets')
export class LostPetsController {
  constructor(private readonly lostPetsService: LostPetsService) {}
 
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateLostPetDto) {
    return this.lostPetsService.create(dto);
  }
}
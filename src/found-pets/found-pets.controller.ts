import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { FoundPetsService } from './found-pets.service';
import { CreateFoundPetDto } from 'src/core/interfaces/found_pet.interface';

@Controller('found-pets')
export class FoundPetsController {
  constructor(private readonly foundPetsService: FoundPetsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateFoundPetDto) {
    return this.foundPetsService.create(dto);
  }
}
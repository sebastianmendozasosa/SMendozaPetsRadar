import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { LostPetsService } from './lost-pets.service';
import { LOST_PETS_LIST_CACHE_KEY } from 'src/core/constants/cache-keys';
import { envs } from 'src/config/envs';
import { CreateLostPetDto } from 'src/core/interfaces/lost_pet.interface';

@Controller('lost-pets')
export class LostPetsController {
  constructor(private readonly lostPetsService: LostPetsService) {}

  @Get()
  @CacheKey(LOST_PETS_LIST_CACHE_KEY)
  @CacheTTL(envs.CACHE_TTL_MS)
  @UseInterceptors(CacheInterceptor)
  findAllActive() {
    return this.lostPetsService.findAllActive();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateLostPetDto) {
    return this.lostPetsService.create(dto);
  }
}
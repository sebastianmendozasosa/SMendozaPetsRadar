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
import { FOUND_PETS_LIST_CACHE_KEY } from 'src/core/constants/cache-keys';
import { envs } from 'src/config/envs';
import { CreateFoundPetDto } from 'src/core/interfaces/found_pet.interface';
import { FoundPetsService } from './found-pets.service';

@Controller('found-pets')
export class FoundPetsController {
  constructor(private readonly foundPetsService: FoundPetsService) {}

  @Get()
  @CacheKey(FOUND_PETS_LIST_CACHE_KEY)
  @CacheTTL(envs.CACHE_TTL_MS)
  @UseInterceptors(CacheInterceptor)
  findAll() {
    return this.foundPetsService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateFoundPetDto) {
    return this.foundPetsService.create(dto);
  }
}
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

import { LOST_PETS_LIST_CACHE_KEY } from 'src/core/constants/cache-keys';
import { LostPet } from 'src/core/db/entities/lost_pets.entity';
import { CreateLostPetDto } from 'src/core/interfaces/lost_pet.interface';

@Injectable()
export class LostPetsService {

  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetsRepository: Repository<LostPet>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  findAllActive() {
    return this.lostPetsRepository.find({
      where: { is_active: true },
      order: { created_at: 'DESC' },
    });
  }

  async create(dto: CreateLostPetDto) {

    const lostPet = this.lostPetsRepository.create({
      name: dto.name,
      species: dto.species,
      breed: dto.breed,
      color: dto.color,
      size: dto.size,
      description: dto.description,
      photo_url: dto.photo_url,
      owner_name: dto.owner_name,
      owner_email: dto.owner_email,
      owner_phone: dto.owner_phone,
      address: dto.address,
      lost_date: new Date(dto.lost_date),
      is_active: true,
      location: {
        type: 'Point',
        coordinates: [dto.longitude, dto.latitude]
      }
    });

    const saved = await this.lostPetsRepository.save(lostPet);
    await this.cacheManager.del(LOST_PETS_LIST_CACHE_KEY);
    return saved;
  }
}
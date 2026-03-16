import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LostPet } from 'src/core/db/entities/lost_pets.entity';
import { CreateLostPetDto } from 'src/core/interfaces/lost_pet.interface';

@Injectable()
export class LostPetsService {

  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetsRepository: Repository<LostPet>,
  ) {}

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

    return await this.lostPetsRepository.save(lostPet);
  }
}
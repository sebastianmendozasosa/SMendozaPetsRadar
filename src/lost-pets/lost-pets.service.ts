import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostPet } from 'src/core/db/entities/lost_pets.entity';
import { CreateLostPetDto } from 'src/core/interfaces/lost_pet.interface';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetRepo: Repository<LostPet>,
  ) {}

  async create(dto: CreateLostPetDto): Promise<LostPet> {
    const lostPet = this.lostPetRepo.create({
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
      is_active: dto.is_active ?? true,
      
      location: {
        type: 'Point',
        coordinates: [dto.longitude, dto.latitude],
      } as any,
    });

    return this.lostPetRepo.save(lostPet);
  }

  async findWithinRadius(
    longitude: number,
    latitude: number,
    radiusMeters = 500,
  ): Promise<(LostPet & { distance: number })[]> {
    const results = await this.lostPetRepo.query(
      `
      SELECT *,
        ST_Distance(
          location::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) AS distance
      FROM lost_pets
      WHERE is_active = true
        AND ST_DWithin(
          location::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          $3
        )
      ORDER BY distance ASC
      `,
      [longitude, latitude, radiusMeters],
    );

    return results;
  }
}

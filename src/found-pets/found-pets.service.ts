import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

import { FOUND_PETS_LIST_CACHE_KEY } from 'src/core/constants/cache-keys';
import { FoundPet } from 'src/core/db/entities/found_pets.entity';
import { LostPet } from 'src/core/db/entities/lost_pets.entity';

import { CreateFoundPetDto } from 'src/core/interfaces/found_pet.interface';

import { EmailService } from 'src/email/email.service';
import { EmailOptions } from 'src/core/interfaces/mail-options.interface';

import { foundPetMatchTemplate } from './templates/found-pets.template';

@Injectable()
export class FoundPetsService {

  constructor(
    @InjectRepository(FoundPet)
    private readonly foundPetRepository: Repository<FoundPet>,

    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,

    private readonly emailService: EmailService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  findAll() {
    return this.foundPetRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async create(dto: CreateFoundPetDto) {

    const foundPet = this.foundPetRepository.create({
      species: dto.species,
      breed: dto.breed,
      color: dto.color,
      size: dto.size,
      description: dto.description,
      photo_url: dto.photo_url,
      finder_name: dto.finder_name,
      finder_email: dto.finder_email,
      finder_phone: dto.finder_phone,
      address: dto.address,
      found_date: new Date(dto.found_date),
      location: {
        type: 'Point',
        coordinates: [dto.longitude, dto.latitude]
      }
    });

    await this.foundPetRepository.save(foundPet);

    const lat = dto.latitude;
    const lon = dto.longitude;

    const pointExpr = 'ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography';

    const lostPets = await this.lostPetRepository
      .createQueryBuilder('lost')
      .addSelect(`ST_Distance(lost.location::geography, ${pointExpr})`, 'distance')
      .where('lost.is_active = true')
      .andWhere(`ST_DWithin(lost.location::geography, ${pointExpr}, 500)`)
      .setParameters({ lat, lon })
      .orderBy(`ST_Distance(lost.location::geography, ${pointExpr})`, 'ASC')
      .getRawAndEntities();

    for (let i = 0; i < lostPets.entities.length; i++) {

      const lostPet = lostPets.entities[i];
      const raw = lostPets.raw[i] as Record<string, unknown>;
      const distanceRaw = raw.distance ?? raw.lost_distance;
      const distance = Number(distanceRaw);

      const template = foundPetMatchTemplate(
        lostPet,
        foundPet,
        distance
      );

      const options: EmailOptions = {
        to: 'sebafiend200604@gmail.com',
        subject: 'Posible coincidencia con tu mascota perdida',
        html: template
      };

      await this.emailService.sendEmail(options);
    }

    await this.cacheManager.del(FOUND_PETS_LIST_CACHE_KEY);

    return {
      message: 'Mascota encontrada registrada'
    };
  }
}
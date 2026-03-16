import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

    private readonly emailService: EmailService
  ) {}

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

    const lostPets = await this.lostPetRepository
      .createQueryBuilder('lost')
      .addSelect(`
        ST_Distance(
          lost.location::geography,
          ST_SetSRID(ST_MakePoint(:lon, :lat),4326)::geography
        )
      `, 'distance')
      .where('lost.is_active = true')
      .andWhere(`
        ST_DWithin(
          lost.location::geography,
          ST_SetSRID(ST_MakePoint(:lon,:lat),4326)::geography,
          500
        )
      `, { lat, lon })
      .orderBy('distance', 'ASC')
      .getRawAndEntities();

    for (let i = 0; i < lostPets.entities.length; i++) {

      const lostPet = lostPets.entities[i];
      const distance = lostPets.raw[i].distance;

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

    return {
      message: 'Mascota encontrada registrada'
    };
  }
}
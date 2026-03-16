import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoundPet } from 'src/core/db/entities/found_pets.entity';
import { CreateFoundPetDto } from 'src/core/interfaces/found_pet.interface';
import { LostPetsService } from '../lost-pets/lost-pets.service';
import { EmailService } from 'src/email/email.service';
import { foundPetMatchTemplate } from './templates/found-pets.template';

@Injectable()
export class FoundPetsService {
  private readonly logger = new Logger(FoundPetsService.name);

  constructor(
    @InjectRepository(FoundPet)
    private readonly foundPetRepo: Repository<FoundPet>,
    private readonly lostPetsService: LostPetsService,
    private readonly mailService: EmailService,
  ) {}

  async create(dto: CreateFoundPetDto): Promise<FoundPet> {
    const foundPet = this.foundPetRepo.create({
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
        coordinates: [dto.longitude, dto.latitude],
      } as any,
    });

    const saved = await this.foundPetRepo.save(foundPet);

    await this.triggerNearbySearch(saved, dto.longitude, dto.latitude);

    return saved;
  }

  private async triggerNearbySearch(
    foundPet: FoundPet,
    longitude: number,
    latitude: number,
  ): Promise<void> {
    try {
      const nearbyLostPets = await this.lostPetsService.findWithinRadius(
        longitude,
        latitude,
        500,
      );

      this.logger.log(
        `Encontradas ${nearbyLostPets.length} mascotas perdidas en 500m del reporte #${foundPet.id}`,
      );

      for (const lostPet of nearbyLostPets) {

  const html = foundPetMatchTemplate(
    lostPet,
    foundPet,
    lostPet.distance,
  );

  await this.mailService.sendEmail({
    to: lostPet.owner_email,
    subject: '🐾 Posible coincidencia con tu mascota perdida',
    html,
  });
}
    } catch (error) {
      this.logger.error(
        `Error en búsqueda de mascotas cercanas al reporte #${foundPet.id}`,
        error,
      );
    }
  }
}
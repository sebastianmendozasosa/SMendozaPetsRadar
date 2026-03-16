import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostPet } from 'src/core/db/entities/lost_pets.entity';
import { LostPetsController } from './lost-pets.controller';
import { LostPetsService } from './lost-pets.service';
import { EmailModule } from 'src/email/email.module';
 
@Module({
  imports: [
    EmailModule, // se importa para usar EmailService en LostPetsService
    TypeOrmModule.forFeature([LostPet])
],
  controllers: [LostPetsController],
  providers: [LostPetsService],
  exports: [LostPetsService], // se exporta para usarlo en FoundPetsModule
})
export class LostPetsModule {}

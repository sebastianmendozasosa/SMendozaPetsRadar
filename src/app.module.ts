import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { LostPetsService } from './lost-pets/lost-pets.service';
import { LostPetsController } from './lost-pets/lost-pets.controller';
import { LostPetsModule } from './lost-pets/lost-pets.module';
import { FoundPetsModule } from './found-pets/found-pets.module';

@Module({
  imports: [EmailModule, LostPetsModule, FoundPetsModule],
  controllers: [AppController, LostPetsController],
  providers: [AppService, LostPetsService],
})
export class AppModule {}

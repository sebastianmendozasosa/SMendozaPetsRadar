import { PetSize } from "../enums/pet-size.enum";

export class CreateLostPetDto {
  name: string;

  species: string;

  breed: string;

  color: string;

  size: PetSize;

  description: string;

  photo_url?: string;

  owner_name: string;

  owner_email: string;

  owner_phone: string;

  
  latitude: number;


  longitude: number;

  address: string;

  lost_date: string;

  is_active?: boolean;
}
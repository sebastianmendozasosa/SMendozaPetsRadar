import { PetSize } from "../enums/pet-size.enum";

export class CreateFoundPetDto {  
    
  species: string;

  breed?: string;

  color: string;
  
  size: PetSize;

  description: string;
  
  photo_url?: string;
  
  finder_name: string;

  finder_email: string;

  finder_phone: string;


  latitude: number;

  longitude: number;

  
  address: string;

  found_date: string;
}
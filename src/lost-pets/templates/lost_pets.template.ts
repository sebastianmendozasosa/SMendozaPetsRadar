import { LostPet } from "src/core/db/entities/lost_pets.entity";
import { generateMapBoxImage } from "src/core/utils/utils";

export const lostPetMatchTemplate = (
  lostPet: LostPet,
  foundPet: any,
  distance: number,
): string => {

  const [lon, lat] = foundPet.location.coordinates;
  const mapImage = generateMapBoxImage(lat, lon);

  return `
  <div style="font-family: Arial, sans-serif; padding:20px">

    <h2 style="color:#ff6b00;">🐶 Posible mascota encontrada cerca de tu reporte</h2>

    <p>
      Hola <strong>${lostPet.owner_name}</strong>, encontramos una mascota
      que podría coincidir con la que reportaste perdida.
    </p>

    <hr/>

    <h3>📍 Ubicación aproximada del hallazgo</h3>

    <img 
      src="${mapImage}"
      alt="Mapa ubicación mascota encontrada"
      style="width:100%;max-width:600px;border-radius:10px"
    />

    <p>
      Distancia aproximada entre reportes:
      <strong>${distance?.toFixed(0)} metros</strong>
    </p>

    <hr/>

    <h3>🐾 Mascota encontrada</h3>

    <ul>
      <li><strong>Color:</strong> ${foundPet.color}</li>
      <li><strong>Tamaño:</strong> ${foundPet.size}</li>
      <li><strong>Descripción:</strong> ${foundPet.description}</li>
    </ul>

    ${
      foundPet.photo_url
        ? `<img src="${foundPet.photo_url}" style="max-width:300px;border-radius:8px"/>`
        : ""
    }

    <hr/>

    <h3>📞 Contacto</h3>

    <ul>
      <li><strong>Nombre:</strong> ${foundPet.finder_name}</li>
      <li><strong>Email:</strong> ${foundPet.finder_email}</li>
      <li><strong>Teléfono:</strong> ${foundPet.finder_phone}</li>
    </ul>

  </div>
  `;
};
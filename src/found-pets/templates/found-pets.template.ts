import { FoundPet } from "src/core/db/entities/found_pets.entity";
import { generateMapBoxImage } from "src/core/utils/utils";

export const foundPetMatchTemplate = (
  lostPet: any,
  foundPet: FoundPet,
  distance: number,
): string => {

  const [lon, lat] = foundPet.location.coordinates;
  const mapImage = generateMapBoxImage(lat, lon);

  return `
  <div style="font-family: Arial, sans-serif; padding:20px">

    <h2 style="color:#ff6b00;">🐾 Posible coincidencia con tu mascota perdida</h2>

    <p>
      Hola <strong>${lostPet.owner_name}</strong>, encontramos una mascota
      que podría coincidir con tu reporte.
    </p>

    <hr/>

    <h3>📍 Ubicación aproximada donde fue encontrada</h3>

    <img 
      src="${mapImage}" 
      alt="Mapa ubicación mascota encontrada"
      style="width:100%;max-width:600px;border-radius:10px;margin-top:10px"
    />

    <p style="font-size:14px;color:#555">
      Distancia aproximada: <strong>${distance?.toFixed(0)} metros</strong>
    </p>

    <hr/>

    <h3>🐶 Información de la mascota encontrada</h3>

    <ul>
      <li><strong>Especie:</strong> ${foundPet.species}</li>
      <li><strong>Raza:</strong> ${foundPet.breed ?? "No especificada"}</li>
      <li><strong>Color:</strong> ${foundPet.color}</li>
      <li><strong>Tamaño:</strong> ${foundPet.size}</li>
      <li><strong>Descripción:</strong> ${foundPet.description}</li>
    </ul>

    ${
      foundPet.photo_url
        ? `<img src="${foundPet.photo_url}" style="max-width:300px;border-radius:8px;margin-top:10px"/>`
        : ""
    }

    <hr/>

    <h3>📞 Contacto de quien encontró la mascota</h3>

    <ul>
      <li><strong>Nombre:</strong> ${foundPet.finder_name}</li>
      <li><strong>Email:</strong> ${foundPet.finder_email}</li>
      <li><strong>Teléfono:</strong> ${foundPet.finder_phone}</li>
    </ul>

    <hr/>

    <p style="font-size:13px;color:#777">
      Este correo fue generado automáticamente por el sistema de búsqueda de mascotas.
    </p>

  </div>
  `;
};
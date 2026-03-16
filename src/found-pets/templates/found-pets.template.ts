import { FoundPet } from 'src/core/db/entities/found_pets.entity';

export const foundPetMatchTemplate = (
  lostPet: any,
  foundPet: FoundPet,
  distance: number,
): string => {
  return `
    <div style="font-family: Arial, sans-serif; padding:20px;">
      
      <h2 style="color:#ff6b00;">🐾 Posible coincidencia con tu mascota perdida</h2>

      <p>
        Hemos encontrado una mascota que podría coincidir con tu reporte de mascota perdida.
      </p>

      <hr/>

      <h3>Información de la mascota encontrada</h3>

      <ul>
        <li><strong>Especie:</strong> ${foundPet.species}</li>
        <li><strong>Raza:</strong> ${foundPet.breed ?? 'No especificada'}</li>
        <li><strong>Color:</strong> ${foundPet.color}</li>
        <li><strong>Tamaño:</strong> ${foundPet.size}</li>
        <li><strong>Descripción:</strong> ${foundPet.description}</li>
      </ul>

      ${
        foundPet.photo_url
          ? `<img src="${foundPet.photo_url}" style="max-width:300px;border-radius:8px;margin-top:10px"/>`
          : ''
      }

      <hr/>

      <h3>Persona que encontró la mascota</h3>

      <ul>
        <li><strong>Nombre:</strong> ${foundPet.finder_name}</li>
        <li><strong>Email:</strong> ${foundPet.finder_email}</li>
        <li><strong>Teléfono:</strong> ${foundPet.finder_phone}</li>
      </ul>

      <p>
        📍 Distancia aproximada entre el reporte y el hallazgo:
        <strong>${distance?.toFixed(0)} metros</strong>
      </p>

      <hr/>

      <p style="font-size:14px;color:#777;">
        Este correo fue generado automáticamente por el sistema de búsqueda de mascotas.
      </p>

    </div>
  `;
};
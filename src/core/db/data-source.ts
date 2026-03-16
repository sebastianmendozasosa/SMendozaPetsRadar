import { envs } from "src/config/envs";
import { FoundPet } from "src/core/db/entities/found_pets.entity";
import { LostPet } from "./entities/lost_pets.entity";
import { DataSource, DataSourceOptions } from "typeorm";


export const dataSourceOptions : DataSourceOptions = {
    type: 'postgres',
      host: envs.DB_HOST,
      port: envs.DB_PORT,
      username: envs.DB_USER,
      password: envs.DB_PASSWORD,
      database: envs.DB_NAME,
      entities: [FoundPet, LostPet],
      migrations: ["dist/src/core/db/migrations/*.js"],
      synchronize: false
};

export const dataSource = new DataSource(dataSourceOptions);
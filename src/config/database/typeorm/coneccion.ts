import path from "node:path";

import { DataSource } from "typeorm";
import { name_env } from "../../constants";
import { OptionsPs } from "./postgreSql";

export class TypeOrmClient {
  static createClient(databaseConfig: OptionsPs): DataSource {
    const isproduction = process.env.ENVIRONMENT === name_env.production;

    const baseOptions = {
      name: databaseConfig.contextName,
      type: databaseConfig.dialect,
      port: databaseConfig.port,
      host: databaseConfig.host,
      username: databaseConfig.username,
      database: databaseConfig.database,
      password: databaseConfig.password,
      synchronize: true,
      logging: false,
      entities: [path.join(__dirname, "../models/*{.js,.ts}")],
      subscribers: [],
      migrations: [path.join(__dirname, "/migrations/*{.js,.ts}")],
    };

    const result = isproduction
      ? { ...baseOptions, ssl: { rejectUnauthorized: false } }
      : baseOptions;

    return new DataSource(result);
  }
}

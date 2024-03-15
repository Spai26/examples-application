import { type DataSource } from "typeorm";
import { TypeOrmClient } from "./coneccion";

type Dialects = "postgres";

export interface OptionsPs {
  contextName?: string;
  dialect: Dialects;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
}

export class PostgresDatabase {
  /**
   * !TODO: generate customError database.
   */
  private static intance: DataSource;

  static async connect(options: OptionsPs): Promise<DataSource> {
    const { contextName, dialect, host, port, username, password, database } =
      options;

    try {
      if (PostgresDatabase.intance !== null) {
        PostgresDatabase.intance = await TypeOrmClient.createClient({
          contextName,
          dialect,
          port,
          host,
          username,
          password,
          database,
        }).initialize();
      }

      return PostgresDatabase.intance;
    } catch (error) {
      throw Error(`database connection fail ${error}`);
    }
  }
}

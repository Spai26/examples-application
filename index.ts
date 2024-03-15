import { app } from "./src/config/app";
import { PostgresDatabase } from "./src/config/database";
import { Server } from "./src/config/server";
import { config as initialDotenv } from "dotenv";

initialDotenv();
(() => {
  main();
})();

async function main(): Promise<void> {
  const connection = await PostgresDatabase.connect({
    dialect: "postgres",
    contextName: process.env.APP_ENV,
    database: process.env.DB_PG_DATABASE,
    host: process.env.DB_PG_HOST,
    password: process.env.DB_PG_PASSWORD,
    port: 5432,
    username: process.env.DB_PG_USER,
  });

  console.log(`✓ Database connected: ${connection?.options.type}`);

  new Server(
    {
      PORT: 8000,
      HOST: process.env.APP_HOST,
      ENVIRONMENT: process.env.APP_ENV,
      APP_NAME: process.env.APP_NAME,
    },
    app
  ).start();
}

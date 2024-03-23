import { app } from "./src/config/app";
import { PostgresDatabase } from "./src/config/database";
import { Server } from "./src/config/server";
import { config as initialDotenv } from "dotenv";
import "reflect-metadata";

initialDotenv();
(() => {
  main();
})();

async function main(): Promise<void> {
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

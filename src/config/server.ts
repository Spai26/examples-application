import http from "node:http";

import express, { type Express, type Router } from "express";
import { name_env } from "./constants";

// variables de configuracion APP
interface Options {
  PORT?: number;
  HOST?: string;
  ENVIRONMENT?: string;
  APP_NAME?: string;
}

class Server {
  public readonly app: Express;

  private readonly port: number;
  private readonly host?: string | undefined;
  private readonly env?: string | undefined;
  private readonly name: string | undefined;

  private readonly server: http.Server;
  private readonly router: Router;

  constructor(options: Options, router: Router) {
    const { PORT = 8000 } = options;
    this.port = PORT;
    this.host = options.HOST;
    this.env = options.ENVIRONMENT;
    this.name = options.APP_NAME;

    // inicializa instancia express
    this.app = express();
    this.server = http.createServer(this.app);
    this.router = router;
    this.app.use(this.router);
  }

  public async start(): Promise<void> {
    await new Promise<void>((resolve, reject): void => {
      this.server.on("error", (error) => {
        reject(error);
      });

      this.server.listen(this.port, () => {
        console.log(`✓ Project ${this.name}`);
        console.log(`✓ Service: ${this.env}`);
        if (this.env !== name_env.production) {
          console.log(`✓ Server running on ${this.host}:${this.port}`);
          console.log(
            `✓ Server Documentation ${this.host}:${this.port}/api-docs`
          );
        }
        resolve();
      });
    });
  }
}

export { Server };

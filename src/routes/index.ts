import { Router } from "express";
import exampleRoute from "./example";
import taksRoute from "./taks";

const apiRoute = Router();

apiRoute.use("/api/example", exampleRoute);
apiRoute.use("/api/taks", taksRoute);

export { apiRoute };

import { Router } from "express";
import exampleRoute from "./example";
import taksRoute from "./taks";
import typeormRoute from "./typeorm.example";

const apiRoute = Router();

apiRoute.use("/api/example", exampleRoute);
apiRoute.use("/api/taks", taksRoute);
apiRoute.use("/api/typeorm", typeormRoute);

export { apiRoute };

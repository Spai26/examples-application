import express from "express";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express";
import { apiRoute } from "../routes";
import { spec } from "./swagger/sw";

const app = express();

app.disable("X-Powered-By");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// endpoint test for production
app.get("/", (req, res) => {
  return res.json({
    message: `welcome to res-api to project ${process.env.APP_NAME}`,
  });
});
app.use(apiRoute);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(spec));

export { app };

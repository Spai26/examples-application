import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: `REST API ${process.env.APP_NAME} for Swagger Documentation`,
      version: "1.0.0",
      description: `This code will be helpful for documentation for future developers who support project, both for frontend and backend!.`,
    },
  },
  schemes: ["http", "https"],
  servers: [
    {
      url: "http://localhost:4000",
      description: "Development server",
    },
  ],
  apis: ["./src/routes/*.ts"],
};

export const spec = swaggerJsDoc(options);

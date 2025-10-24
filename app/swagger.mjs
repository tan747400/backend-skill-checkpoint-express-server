import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const productionUrl = process.env.API_URL;

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Skill Checkpoint Express API",
      version: "1.0.0",
      description: "API docs for questions, answers, votes, and scores",
    },
    servers: [
      ...(productionUrl
        ? [
            {
              url: productionUrl,
              description: "Production",
            },
          ]
        : []),
      {
        url: "http://localhost:4000",
        description: "Local Dev",
      }
    ],
  },
  // สแกน JSDoc บน router ทั้งหมดของคุณ
  apis: ["app/*.mjs", "app/**/*.mjs"],
});

export function mountSwagger(app) {
  // raw spec (useful for client generation / healthcheck)
  app.get("/docs.json", (_req, res) => {
    res.json(swaggerSpec);
  });

  // pretty UI
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
    })
  );
}
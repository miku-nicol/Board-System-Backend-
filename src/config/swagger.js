const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Collaborative Board API",
      version: "1.0.0",
      description: "API documentation for the Collaborative Workspace Application"
    },
    servers: [
      {
        url: "http://localhost:9000/api/v1"
      }
    ]
  },
  apis: ["./src/modules/**/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
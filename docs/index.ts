import express from "express";
export const routes = express.Router();
const swaggerUi = require('swagger-ui-express');
const { setupOpt, specs } = require('./apiSwaggerConfig');

routes.use("/", swaggerUi.serve);
routes.get("/", swaggerUi.setup(specs, setupOpt));

//export api_doc = routes;
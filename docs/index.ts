import express from "express";
const routes = express.Router();
const swaggerUi = require('swagger-ui-express');
const { setupOpt, specs } = require('./apiSwaggerConfig');

routes.use("/", swaggerUi.serve);
routes.get("/", swaggerUi.setup(specs, setupOpt));

module.exports = routes;
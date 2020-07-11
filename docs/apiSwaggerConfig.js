const swaggerJsdoc = require('swagger-jsdoc');

// Swagger doc set up
const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: "Outdur API",
            version: "1.0.0",
            description: "This is a Outdur API"
        },
        servers: [
            {
                url: "http://remote-host:3000/api"
            },
            {
                url: "http://localhost:3000/api"
            }
        ]
    },
    apis: ['./docs/*/*.yml']
};

// Swagger set up
exports.setupOpt = setupOpt = {
    explorer: true,
    swaggerOptions: {
        authAction: { JWT: { name: "JWT", schema: { type: "apiKey", in: "header", name: "Authorization", description: "" }, value: "Bearer <JWT>" } },
    }
};

exports.specs = swaggerJsdoc(options);
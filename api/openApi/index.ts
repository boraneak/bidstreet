import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bidstreet API Documentation',
      version: '1.0.0',
      description: 'First version of API documentation for Bidstreet',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['/src/routes/*.ts', './openApi/*.ts'],
};

export const specs = swaggerJsdoc(options);

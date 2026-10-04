import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TurnosRed API',
      version: '1.0.0',
      description:
        'API REST para la gestión de turnos médicos y su recurso Médico.',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Turno: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            paciente: { type: 'string' },
            documento: { type: 'string' },
            especialidad: {
              type: 'string',
              enum: ['Clínica médica', 'Pediatría', 'Odontología', 'Nutrición'],
            },
            fecha: { type: 'string', example: '2026-08-14' },
            hora: { type: 'string', example: '10:00' },
            confirmado: { type: 'boolean' },
            observaciones: { type: 'string' },
            medicoId: { type: 'integer' },
          },
        },
        Medico: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            especialidad: {
              type: 'string',
              enum: ['Clínica médica', 'Pediatría', 'Odontología', 'Nutrición'],
            },
            disponible: { type: 'boolean' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'integer' },
            message: { type: 'string' },
            code: { type: 'string' },
            details: { type: 'array', items: {} },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
});

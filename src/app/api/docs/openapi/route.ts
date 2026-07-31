import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'SwiftPay API',
    version: '1.0.0',
    description: 'Public REST API for SwiftPay Pix payment processing',
  },
  servers: [
    {
      url: process.env.API_BASE_URL || 'http://localhost:3001',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      apiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
      },
    },
  },
  security: [
    {
      apiKey: [],
    },
  ],
}

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/app/api/v1/**/route.ts'],
}

export function GET() {
  const spec = swaggerJSDoc(swaggerOptions)
  return Response.json(spec)
}
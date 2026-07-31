import { NextResponse } from 'next/server'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

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

const swaggerSpec = swaggerJSDoc(swaggerOptions)

export { swaggerSpec }

export async function GET() {
  return NextResponse.json(swaggerSpec)
}
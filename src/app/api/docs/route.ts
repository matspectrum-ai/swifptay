import { NextResponse } from 'next/server'
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

export async function GET() {
  const spec = swaggerJSDoc(swaggerOptions)

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SwiftPay API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
  <style>
    body { margin: 0; padding: 0; background: #0A0A0A; }
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #7CFC00; }
    .swagger-ui .scheme-container { background: #111; }
    .swagger-ui .btn { background: #7CFC00; color: #0A0A0A; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        spec: ${JSON.stringify(spec)},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis],
        layout: 'BaseLayout',
      })
    }
  </script>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
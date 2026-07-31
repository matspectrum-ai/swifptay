#!/usr/bin/env bash
set -euo pipefail

echo "🚀 SwiftPay setup"

if [ ! -f .env ]; then
  echo "📋 .env not found. Copying .env.example..."
  cp .env.example .env
  echo "✅ .env created. Edit it with your credentials."
else
  echo "✅ .env already exists."
fi

if [ -z "${DATABASE_URL:-}" ] && grep -q "DATABASE_URL=" .env; then
  echo "⚠️  DATABASE_URL is empty in .env. Set it before running migrations."
fi

echo "🔧 Running prisma generate..."
npx prisma generate

echo "🧱 Running prisma migrate deploy..."
npx prisma migrate deploy || echo "⚠️  migrate deploy failed or no migrations yet."

echo "🌱 Running prisma db seed..."
npx prisma db seed || echo "⚠️  seed failed or skipped."

echo "✅ Setup complete."
echo "Next: npm run dev"

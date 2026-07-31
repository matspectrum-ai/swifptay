.PHONY: dev build test lint typecheck migrate seed deploy

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

test:
	npm run test

test:watch:
	npm run test:watch

test:coverage:
	npm run test:coverage

test:e2e:
	npm run test:e2e

lint:
	npm run lint

typecheck:
	npm run typecheck

migrate:
	npm run prisma:migrate

seed:
	npm run prisma:seed

prisma:generate:
	npm run prisma:generate

prisma:studio:
	npm run prisma:studio

docker:build:
	docker compose build

docker:up:
	docker compose up -d

docker:down:
	docker compose down

docker:logs:
	docker compose logs -f

deploy:
	git push origin master
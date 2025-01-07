## Description

// TODO: add comprehensive description of this service

## Prerequisites

- Node.js (23 upwards, LTS)
- PNPM
- Docker
- Docker Compose

## Setup

```bash
$ pnpm install
$ docker-compose up -d
```

Open Conductor URL in your browser (typically [http://localhost:8080](http://localhost:8080)). And register an account there.

Copy `.env.example` to `.env` and change following variables:

```
KAFKA_SCHEMA_REGISTRY_USERNAME=""
KAFKA_SCHEMA_REGISTRY_PASSWORD=""
```

## Running and development

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```
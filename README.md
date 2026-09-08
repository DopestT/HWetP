# HERWET Production Frontend

HERWET is being rebuilt from the approved Base44 visual blueprint into a standalone production codebase.

## Current state

- React + Vite + Tailwind frontend
- HERWET ocean / water-plasma visual system
- responsive navigation and mobile interaction pass
- home, search, category, watch, favorites/history, and trust & safety routes
- session-scoped 18+ gate placeholder
- device-local favorites and viewing history
- PostgreSQL source authorization, moderation, catalog, report, and takedown schema
- Fastify API for public catalog reads plus report/takedown case creation
- frontend catalog adapter: production API first, neutral local fallback when the API is unavailable
- approved catalog thumbnails and direct licensed/remote video playback supported by the watch route
- Docker + nginx + Caddy + PostgreSQL deployment foundation
- neutral QA seed for end-to-end API testing without real media
- pre-launch `noindex` policy
- GitHub CI validation

No production adult media, third-party source feeds, payments, user accounts, advertising, or production age-verification provider are connected yet.

## Development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Frontend container:

```bash
docker build -t herwet-frontend .
docker run --rm -p 8080:80 herwet-frontend
```

## Full-stack QA with neutral data

Copy the example environment first:

```bash
cp .env.example .env
```

Replace the placeholder PostgreSQL password and operations email in `.env`, then start a fresh QA stack with the neutral catalog seed:

```bash
cd deploy
docker compose -f docker-compose.yml -f docker-compose.qa.yml up --build -d
```

The QA seed contains metadata-only placeholder records and `example.invalid` media references. It exists only to exercise the real database → API → frontend path without connecting adult media.

For an existing database volume, PostgreSQL init scripts do not rerun automatically. Use a fresh QA volume or apply `server/db/seed-neutral.sql` manually.

## Production direction

The public catalog is deliberately constrained by database authorization and moderation state: only records from approved sources that have also passed moderation appear through the `public_videos` view.

Real media should only be connected after hosting, age assurance, privacy, reporting/takedown operations, source authorization, moderation procedures, and jurisdiction-specific launch requirements are finalized.

The Base44 app remains the visual reference. The `herwet-production-v1` branch and its draft pull request are the production implementation under active validation.

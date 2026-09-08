# HERWET Production Frontend

HERWET is being rebuilt from the approved Base44 visual blueprint into a standalone production codebase.

## Current state

- React + Vite + Tailwind frontend
- HERWET ocean / water-plasma visual system
- responsive navigation and mobile interaction pass
- home, search, category, watch, favorites/history, and trust & safety routes
- session-scoped 18+ gate placeholder
- device-local favorites and viewing history
- report and takedown UI placeholders
- neutral catalog placeholders only
- Docker + nginx deployment foundation
- pre-launch `noindex` policy

No production adult media, source feeds, payments, user accounts, advertising, or moderation backend are connected yet.

## Development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Container:

```bash
docker build -t herwet-frontend .
docker run --rm -p 8080:80 herwet-frontend
```

## Production direction

The frontend is designed to sit in front of a separate catalog/API layer and approved content-source integrations. Real content should only be connected after hosting, age-assurance, privacy, reporting/takedown operations, source authorization, and moderation requirements are finalized.

The Base44 app remains the visual reference; this repository is the production implementation.

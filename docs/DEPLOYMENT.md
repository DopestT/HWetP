# HERWET deployment runbook

This branch is designed for an Ubuntu VPS running Docker Compose. Use a hosting provider whose current acceptable-use policy permits the lawful content and business model you intend to operate before deploying real media.

## 1. Server prerequisites

- Ubuntu 24.04 LTS or equivalent
- Docker Engine + Docker Compose plugin
- firewall allowing SSH, TCP 80, TCP/UDP 443
- enough disk for PostgreSQL, logs, and backups
- real production secrets stored only in `.env`

## 2. DNS

Point the apex domains to the server's public IP before enabling Caddy TLS:

- `herwet.com`
- `www.herwet.com`
- `herwet.net`
- `herwet.video`
- `herwet.me`
- `herwet.online`

The included Caddy configuration serves `herwet.com`, redirects `www` to the apex, and permanently redirects the secondary HERWET domains to `https://herwet.com`.

## 3. Environment

From the repository root:

```bash
cp .env.example .env
```

Set a long random PostgreSQL password and an operations email for ACME certificate notices. Do not commit `.env`.

## 4. Launch the stack

```bash
docker compose --env-file .env -f deploy/docker-compose.yml build
docker compose --env-file .env -f deploy/docker-compose.yml up -d
```

Check status:

```bash
docker compose --env-file .env -f deploy/docker-compose.yml ps
```

View logs:

```bash
docker compose --env-file .env -f deploy/docker-compose.yml logs -f --tail=200
```

## 5. Health checks

Frontend edge:

```bash
curl -fsS https://herwet.com/healthz
```

API/database health through the internal stack:

```bash
docker compose --env-file .env -f deploy/docker-compose.yml exec api wget -qO- http://127.0.0.1:3001/healthz
```

## 6. Backups

Reports and takedown requests can contain sensitive contact information. Database backups should be encrypted, access-controlled, and retained only as long as operationally necessary.

Example database dump:

```bash
docker compose --env-file .env -f deploy/docker-compose.yml exec -T db \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc > herwet-$(date +%F).dump
```

Move the dump immediately into your encrypted backup system; do not leave unencrypted dumps in a public or shared directory.

## 7. Before real content

Do not connect real media until all of the following are resolved:

- current hosting policy confirmed
- age-assurance requirements selected for served jurisdictions
- privacy/terms reviewed for the actual company and data flows
- report/takedown queue staffed and tested
- content-source authorization documented
- consent/rights evidence process defined
- moderation and prohibited-content rules operational
- monitoring, backups, incident response, and abuse escalation tested

The database intentionally requires a content source to be `approved` and a video to be moderation `approved` before it can appear in the `public_videos` view.

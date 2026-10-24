# JusticeRollOn — Karandeep MVC demonstration

Minimal **newly developed** prototype based on the DNC JusticeRollOn project description. This is **not** a copy of or a verified integration with the original repositories, and is **not** a deployed production legal application.

## Features
- MVC-style project separation: `src/models`, `src/views`, `src/controllers`
- Dashboard, petition records, deposition records, legal-aid requests
- Create/read records and change workflow status (Open / In Review / Closed)
- Local JSON persistence through an atomic file replacement
- HTML escaping, basic input bounds, optional HTTP Basic Auth (`DEMO_PASSWORD`)
- `/health` JSON status for Docker and AWS load balancer health checks
- Node 22, Docker, Docker Compose, GitHub Actions tests

## Run on Windows or Linux

```sh
node --version
npm test
npm start
```
Open `http://localhost:3000`. For a password-protected demonstration, set `DEMO_PASSWORD` before starting; username is `demo`. The app listens on port 3000 by default.

## Run with Docker Compose (recommended for demo)

```sh
cp .env.example .env
# Edit .env: replace the demonstration password with your own long random secret.
docker compose up -d --build
docker compose ps
curl http://localhost:3000/health
```

The compose file binds port 3000 to **localhost**, not the public internet. Configure a reverse proxy and TLS before allowing access from outside the server. Persisted data is held in the named `jro_demo_data` volume.

## Limitations and security
This prototype is **for synthetic data only**. The JSON store is not safe for concurrent distributed writes, has no fine-grained authorization, session management, encryption at rest, audit logging, legal compliance review, real deposition intelligence, file upload, or RDS/S3 integration. Basic Auth is only appropriate behind HTTPS. Do not use real legal cases or personal information. An AWS `available` database does not mean this app is connected to it.

## Sources considered
- https://github.com/ashir11-ml/justicerollon-devops — public repository with Hello World Node app and DevOps assets (not cloned into this project)
- https://github.com/SrihithaIT/ICT802 — public JusticeRollOn capstone repo; the `production` directory's contents were not verified or copied

## Ownership and Git provenance
These are new code files, committed locally with Git `user.name=karandeep-jor` and `user.email=karandeep-jor@gmail.com` at the user's request. Git author metadata alone does not verify who performed the work. No past dates or original repository history have been fabricated. See `docs/GIT-AND-DEPLOY.md`.

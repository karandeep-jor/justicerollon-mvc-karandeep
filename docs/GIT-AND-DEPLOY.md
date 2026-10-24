# GitHub upload and EC2 demo deployment

## Existing local Git history
The downloaded ZIP includes a `.git` folder with commits generated during the actual build of this prototype. Review `git log --oneline --decorate` and `git status`.

## Push to a new repository you control
```powershell
git config user.name "karandeep-jor"
git config user.email "karandeep-jor@gmail.com"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-ACCOUNT/justicerollon-mvc-karandeep.git
git push -u origin main
```
Create the empty repository on GitHub first, and replace `YOUR-GITHUB-ACCOUNT`. Git metadata does not authenticate a GitHub account. Log in using Git Credential Manager or `gh auth login`. Do not push to third-party repositories without their maintainers' authorization.

## Deploy to AWS EC2 (after setting up Node or Docker)
Connect by SSH using your own EC2 key. On the server, install Docker Engine + Compose plugin and clone YOUR repository (not the original). Then:
```bash
cd justicerollon-mvc-karandeep
cp .env.example .env
nano .env
# Replace DEMO_PASSWORD with a strong secret.
sudo docker compose up -d --build
sudo docker compose ps
curl http://127.0.0.1:3000/health
```
The compose file binds `127.0.0.1:3000`; to view it remotely use SSH local port forwarding:
```powershell
ssh -i "$HOME/.ssh/JRO-Lab-Key.pem" -L 3000:127.0.0.1:3000 ubuntu@YOUR_EC2_PUBLIC_IP
```
Open `http://127.0.0.1:3000` locally and sign in as `demo` with your chosen password. Do not expose HTTP Basic Auth credentials over public HTTP. For a public demo link, configure HTTPS on Nginx with a valid certificate before enabling external access.

## Screenshot cues (only capture after verifying)
1. Git log: `git log --oneline --decorate -8` — **Figure 1:** Local Git commits for the JusticeRollOn MVC prototype under the configured author identity.
2. Local test: `npm test` — **Figure 2:** Successful automated test execution covering data persistence, sanitization, and HTTP health endpoints.
3. Dashboard in browser — **Figure 3:** MVC dashboard showing petition, deposition, and legal-aid workflows.
4. Petitions list and create form — **Figure 4:** Functional petition entry and status tracking demonstration.
5. Docker status: `docker compose ps` — **Figure 5:** Running Dockerized JusticeRollOn service with health check.
6. AWS EC2 Instances console — **Figure 6:** Cloud deployment instance used to host the MVC demonstration.

## Production gaps
Real application architecture requires a relational database, migrations, role-based users, audit logging, data retention, secure upload to S3, RDS connectivity, HTTPS, observability and legal/privacy review. See the README's limitations.

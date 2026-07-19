# More Advisor Project Clone

This project is a full-stack advisor workflow application inspired by the Cisco Data Advisor experience. It provides an advisor list, guided YES/NO question flow, dynamic branching, and rich outcome guidance content.

## Stack

- Frontend: React 19, TypeScript, Vite, Vitest, Oxlint
- Backend: FastAPI, SQLAlchemy, SQLite, OpenPyXL, Pytest
- DevOps: Docker, Docker Compose, GitHub Actions CI

## Run locally

### Backend

```powershell
Set-Location backend
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
.\.venv\Scripts\uvicorn app.main:app --reload
```

API: http://localhost:8000

### Frontend

```powershell
Set-Location frontend
npm install
npm run dev
```

App: http://localhost:5173

## Docker

```powershell
docker compose up --build
```

Frontend: http://localhost:8080

## API

The backend exposes advisor-focused endpoints under `/api/v1`:

- `GET /health`
- `GET /advisors`
- `GET /advisors/{advisor_id}`
- `PUT /advisors/{advisor_id}/questions/{question_id}`
- `DELETE /advisors/{advisor_id}/answers`

## CI/CD

GitHub Actions in `.github/workflows/ci.yml` covers:

- backend dependency install and `pytest`
- frontend dependency install, `npm run lint`, `npm run test`, and `npm run build`
- `docker compose build` to validate container images

## Notes

- Seed data is included so the UI works immediately.
- The project is built from screenshots only because no original Excel or source project was present in the workspace.

# More Advisor Sales Clone

This project is a fresh full-stack clone inspired by the sales and QR collection flow from your screenshots. It focuses on an advisor-only workflow: track orders, generate collection QR codes, collect orders by pin, and import sales rows from CSV or Excel files.

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

## Import format

The backend accepts `.csv` and `.xlsx` files through `POST /api/v1/orders/import`.

Supported column names:

- `order_ref` or `Order Ref`
- `customer_name` or `Customer Name`
- `advisor_name` or `Advisor Name`
- `counter_name` or `Counter Name`
- `counter_code` or `Counter Code`
- `item_name` or `Item Name`
- `quantity`
- `total_amount` or `Total`
- `status`

## CI/CD

GitHub Actions in `.github/workflows/ci.yml` covers:

- backend dependency install and `pytest`
- frontend dependency install, `npm run lint`, `npm run test`, and `npm run build`
- `docker compose build` to validate container images

## Notes

- Seed data is included so the UI works immediately.
- The project is built from screenshots only because no original Excel or source project was present in the workspace.
- Once you add the real Excel file, the importer can be adjusted to match its exact headers and business rules.
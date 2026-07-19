# More Advisor Sales Clone - Project Documentation

## 1. Project Overview
This project is a full-stack advisor workflow application inspired by the Cisco Data Advisor experience. It helps users answer guided questions and reach the correct outcome content based on their responses.

The system is designed to:
- Show questions in sequence.
- Keep previous answers visible while moving forward.
- Display detailed outcome guidance, including table-based policy content.
- Run in both local development and Docker environments.

## 2. What This Project Covers
The project covers four major areas:

### 2.1 Advisor Experience
- Advisor list page with search and expand/collapse support.
- Advisor detail page with guided YES/NO flow.
- Start Over behavior to reset the selected advisor path.
- Back navigation to return from advisor detail to advisor list.

### 2.2 Decision Flow and Outcomes
- One-by-one question progression.
- Preservation of previously answered questions in the same session.
- Dynamic branching to next question or final outcome.
- Outcome pages with rich HTML content and policy tables.

### 2.3 Backend Services and Data
- API endpoints for advisor list, advisor detail, answer updates, and reset.
- Progress resolution logic that computes:
  - current question
  - current outcome
  - answered question count
- Answer persistence using database storage.
- Optional workbook-based content override support.

### 2.4 Deployment and Runtime
- Containerized backend and frontend.
- Docker Compose for full stack startup.
- Runtime port mapping for quick access.

## 3. Main Outcomes Delivered
The project achieved the following outcomes:

1. Functional advisor flow is complete.
2. Previous answered questions remain visible while the next question appears.
3. Outcome content renders correctly, including large tabular sections.
4. Frontend and backend both pass build/test validation.
5. Dockerized version builds and runs successfully.

## 4. Technologies Used and Why

### 4.1 Frontend
- React 19: component-based UI and state-driven rendering.
- TypeScript: stronger type safety and maintainability.
- Vite: fast development server and production build.
- Vitest: frontend unit testing.
- Oxlint: linting and code quality checks.

### 4.2 Backend
- FastAPI: high-performance API framework.
- SQLAlchemy: ORM for structured data access.
- SQLite: lightweight persistence for answers and app data.
- OpenPyXL: workbook parsing for configurable advisor content.
- Pytest: backend and API behavior validation.

### 4.3 DevOps
- Docker: consistent runtime packaging across environments.
- Docker Compose: one-command orchestration for frontend + backend.

## 5. Implementation Notes

### 5.1 Question Progression Logic
The advisor flow follows a decision-tree model. For each question, the response decides either:
- the next question id, or
- the final outcome id.

The frontend renders the traversed path so users can still see previously answered questions while continuing to the current active question.

### 5.2 Outcome Table Rendering
Outcome sections are displayed as rich HTML content. Table styling was tuned to improve readability and better match the reference format (font style, border appearance, spacing, and first-column layout).

## 6. Validation Summary

### 6.1 Frontend Validation
- Lint check: passed
- Unit tests: passed
- Production build: passed

### 6.2 Backend Validation
- Test suite: passed
- Advisor API behavior: verified

### 6.3 Runtime Validation
- Health endpoint: successful
- Advisors endpoint: successful
- Flow progression: verified using sequential YES responses
- Browser checks: question preservation and outcome rendering confirmed

### 6.4 Docker Validation
- Docker engine connectivity: successful
- Docker Compose build: successful
- Containers started: successful
- Frontend and backend reachable on exposed ports

## 7. Runtime Access
- Frontend: http://127.0.0.1:8080
- Backend health: http://127.0.0.1:8000/api/v1/health
- Advisors API: http://127.0.0.1:8000/api/v1/advisors

## 8. Known Non-Blocking Observation
- OpenPyXL may show a default style warning for some workbook files. This warning does not impact application behavior.

## 9. Recommended Evidence to Capture
If you want to keep implementation evidence together, capture these screenshots:
1. Advisor list view.
2. Question flow with previous answers still visible.
3. Final outcome page with policy table.
4. Docker containers running.
5. API health response.

## 10. Current Project State
The project is implemented, tested, and operational. Core advisor workflow behavior, UI rendering, API logic, and containerized deployment are all validated.

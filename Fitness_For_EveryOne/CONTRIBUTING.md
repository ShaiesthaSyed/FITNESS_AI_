# Contributing to Fitness For Everyone

Thank you for your interest in contributing! 🎉

## Getting Started

1. **Fork** this repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/BhanuPrakash-16/Fitness_For_EveryOne.git
   cd Fitness_For_EveryOne
   ```
3. Create a **feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Local Development

### Backend (FastAPI)

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload

```

### Frontend (Vite + React)

```bash
cd frontend
npm install
npm run dev
```

## Code Standards

- **Python**: Follow PEP 8. Use type hints where possible.
- **JavaScript/React**: Follow ESLint rules configured in the project.
- Write clear commit messages: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`.

## Submitting a Pull Request

1. Ensure your code **builds** and **lints** without errors.
2. Push your branch and open a PR against `main`.
3. Fill in the PR template with a clear description.
4. Wait for CI checks to pass and a maintainer review.

## Reporting Issues

Use the [Bug Report](/.github/ISSUE_TEMPLATE/bug_report.md) or [Feature Request](/.github/ISSUE_TEMPLATE/feature_request.md) templates.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

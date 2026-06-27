# Contributing to ToolNest

Thank you for your interest in contributing to ToolNest!

---

## Development Setup

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Git

### Setup

```bash
git clone https://github.com/your-org/toolnest.git
cd toolnest
pnpm install
cp .env.example .env
```

### Running Locally

```bash
pnpm dev
```

---

## Branch Strategy

| Branch              | Purpose                    |
| ------------------- | -------------------------- |
| `main`              | Production-ready code only |
| `develop`           | Integration branch         |
| `feature/<name>`    | New features               |
| `bugfix/<name>`     | Bug fixes                  |
| `hotfix/<name>`     | Urgent production fixes    |
| `release/<version>` | Release preparation        |

**Never commit directly to `main`.**

---

## Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Allowed Types

| Type       | When to Use                     |
| ---------- | ------------------------------- |
| `feat`     | New feature                     |
| `fix`      | Bug fix                         |
| `refactor` | Code change without feature/fix |
| `docs`     | Documentation changes           |
| `style`    | Formatting, whitespace          |
| `test`     | Adding or updating tests        |
| `build`    | Build system, dependencies      |
| `ci`       | CI/CD configuration             |
| `perf`     | Performance improvements        |
| `chore`    | Maintenance, tooling            |
| `revert`   | Revert a previous commit        |

### Examples

```
feat(upload): add drag and drop file upload
fix(search): resolve mobile keyboard overflow
docs(readme): add deployment section
refactor(api): simplify axios error handling
```

---

## Coding Standards

- Follow every rule in `MASTER PROJECT SPECIFICATION`
- TypeScript strict mode is enforced
- All components must be responsive (mobile-first)
- All interactive elements must be keyboard accessible
- No `any` type without justification
- No hardcoded values — use constants or config
- No direct DOM manipulation outside hooks
- Business logic belongs in hooks/services, not components

---

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature develop`
3. Make your changes following the coding standards
4. Run validation: `pnpm validate`
5. Commit with a conventional commit message
6. Push to your fork and open a PR targeting `develop`
7. Fill in the PR template completely
8. Request a review

### PR Checklist

- [ ] Code follows project coding standards
- [ ] TypeScript compiles without errors (`pnpm typecheck`)
- [ ] ESLint passes (`pnpm lint`)
- [ ] Code is formatted (`pnpm format:check`)
- [ ] No `console.log` left in code
- [ ] Components are responsive and accessible
- [ ] PR title follows Conventional Commits format

---

## Code Review

All PRs require at least one approval before merging.

Reviewers check for:

- Correctness
- Architecture alignment
- Performance impact
- Security implications
- Accessibility
- Code readability and maintainability

---

## Questions?

Open an issue or start a GitHub Discussion.

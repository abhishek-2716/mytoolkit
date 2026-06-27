# ToolNest

> **Free Online Productivity Tools — Fast, Secure, Modern**

ToolNest is a scalable, SEO-friendly online utility platform that provides free productivity tools
for everyone. From PDF conversion and image compression to developer utilities and calculators — all
in one place, no sign-up required.

---

## Features

- 🚀 **Fast** — Optimized for speed at every layer
- 🔒 **Secure** — Input validation, file sanitization, secure downloads
- 📱 **Mobile First** — Fully responsive on all devices
- ♿ **Accessible** — WCAG-compliant, keyboard navigable
- 🔍 **SEO Friendly** — Every tool has a dedicated, indexable page
- 🌙 **Dark Mode** — System-aware theme with no flash
- ⚡ **No Registration** — Free tools work without an account

---

## Tech Stack

| Layer    | Technology                              |
| -------- | --------------------------------------- |
| Frontend | React 19, Vite, TypeScript, TailwindCSS |
| State    | Zustand, TanStack Query                 |
| Forms    | React Hook Form + Zod                   |
| Backend  | Node.js, Express, TypeScript, Prisma    |
| Database | PostgreSQL                              |
| Storage  | Local (dev) / S3-compatible (prod)      |
| Auth     | JWT + bcrypt                            |
| Styling  | TailwindCSS v4                          |

---

## Architecture Overview

```
toolnest/
├── apps/
│   ├── frontend/     # React 19 + Vite SPA
│   ├── backend/      # Express API (Phase 2)
│   └── admin/        # Admin dashboard (Phase 3)
├── packages/
│   ├── shared-types/ # Shared TypeScript types
│   ├── shared-utils/ # Shared utility functions
│   └── shared-ui/    # Shared UI components
├── docs/             # Project documentation
├── scripts/          # Automation scripts
└── deployment/       # Deployment configuration
```

---

## Getting Started

### Prerequisites

- Node.js `>= 20.0.0`
- pnpm `>= 9.0.0`

```bash
# Install pnpm if not already installed
npm install -g pnpm
```

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/toolnest.git
cd toolnest

# Install all workspace dependencies
pnpm install

# Copy environment template
cp .env.example .env
# Edit .env with your local values
```

### Development

```bash
# Start frontend development server
pnpm dev

# Or start a specific app
pnpm --filter @toolnest/frontend dev
```

The frontend will be available at `http://localhost:3000`.

---

## Scripts

| Script              | Description                      |
| ------------------- | -------------------------------- |
| `pnpm dev`          | Start frontend dev server        |
| `pnpm build`        | Build frontend for production    |
| `pnpm preview`      | Preview production build locally |
| `pnpm lint`         | Run ESLint across all packages   |
| `pnpm lint:fix`     | Auto-fix lint issues             |
| `pnpm format`       | Format all files with Prettier   |
| `pnpm format:check` | Check formatting without writing |
| `pnpm typecheck`    | Run TypeScript type checks       |
| `pnpm validate`     | Run format + typecheck + lint    |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values.

See [docs/deployment/environment-variables.md](docs/deployment/README.md) for full documentation.

---

## Code Quality & Git Hooks

### How Git Hooks Work

Husky installs two Git hooks automatically when you run `pnpm install`:

| Hook         | Trigger       | What it does                                           |
| ------------ | ------------- | ------------------------------------------------------ |
| `pre-commit` | Before commit | Runs `lint-staged` — formats staged files, checks lint |
| `commit-msg` | After message | Validates message follows Conventional Commits format  |

### Commit Message Convention

This project enforces [Conventional Commits](https://www.conventionalcommits.org/).

**Format:** `<type>(<scope>): <description>`

| Type       | When to use                       |
| ---------- | --------------------------------- |
| `feat`     | New feature                       |
| `fix`      | Bug fix                           |
| `refactor` | Code change, not a feature or fix |
| `docs`     | Documentation only                |
| `style`    | Formatting, whitespace            |
| `test`     | Adding or updating tests          |
| `build`    | Build system or dependencies      |
| `ci`       | CI/CD configuration               |
| `perf`     | Performance improvement           |
| `chore`    | Maintenance tasks                 |
| `revert`   | Revert a previous commit          |

**Valid examples:**

```
feat(upload): add drag-and-drop upload component
fix(search): resolve mobile keyboard overflow
docs(readme): update installation guide
refactor(api): simplify axios error handling
```

**Invalid examples (rejected by commitlint):**

```
Update stuff           ← no type
FEAT: add upload       ← uppercase type
feat: Add Upload.      ← uppercase subject, trailing period
```

### Running Linting Manually

```bash
# Lint all packages
pnpm lint

# Lint and auto-fix
pnpm lint:fix

# Lint only the frontend
pnpm --filter @toolnest/frontend lint
```

### Running Formatting Manually

```bash
# Format everything
pnpm format

# Check formatting without writing
pnpm format:check

# Format only frontend source
pnpm --filter @toolnest/frontend format
```

### Running Type Checks Manually

```bash
# Type-check all packages
pnpm typecheck

# Type-check only the frontend
pnpm --filter @toolnest/frontend typecheck
```

### Full Validation (CI equivalent)

```bash
pnpm validate
```

Runs: `format:check` → `typecheck` → `lint`

### Import Ordering

Imports are automatically sorted on commit using `eslint-plugin-simple-import-sort`.

The enforced order:

1. External packages (`react`, `axios`, etc.)
2. Internal monorepo packages (`@toolnest/*`)
3. Components, features, layouts, pages (`@/components/*`, etc.)
4. Hooks (`@/hooks/*`)
5. Services & providers (`@/services/*`, `@/providers/*`)
6. Utilities, config, constants
7. Types (`@/types/*`)
8. Store (`@/store/*`)
9. Styles & assets
10. Relative imports (`./`, `../`)

### Bypassing Hooks (Emergency Only)

```bash
# Skip pre-commit hook (use ONLY in genuine emergencies)
git commit --no-verify -m "chore: emergency fix"
```

**Never use `--no-verify` routinely.** If hooks fail, fix the issue instead.

---

## Project Roadmap

| Phase | Focus                     | Status         |
| ----- | ------------------------- | -------------- |
| 1     | Foundation & Architecture | ✅ Complete    |
| 2     | PDF & Image Tools         | 🔄 In Progress |
| 3     | Developer Tools & Blog    | 📋 Planned     |
| 4     | Performance & Caching     | 📋 Planned     |
| 5     | AI Tools & Premium        | 📋 Planned     |

---

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a
pull request.

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

---

## Security

For security vulnerability reports, please see [SECURITY.md](SECURITY.md).

---

## License

[MIT](LICENSE) © ToolNest

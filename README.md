# Jordi Sanchez Portfolio

Personal portfolio built with React, Vite and Tailwind CSS. The current stable release is `1.0.0`.

Content is managed from a Zod-validated JSON file. UI styles are colocated with each component, shared component styles live under `src/components/shared`, and static SVG icons are served from `public/icons` so they are requested only by the components that render them.

The project includes unit, accessibility, end-to-end, link and Lighthouse checks in CI.

![Portfolio](./portfolio.gif)

Production URL: https://portfolio-iota-sandy-c1tlxc4d2t.vercel.app/

## Stack

- React 19
- Vite 8
- Tailwind CSS 4
- Colocated component CSS
- Zod
- Sentry, Vercel Analytics and Vercel Speed Insights
- Vitest + Testing Library
- Playwright + axe-core
- Lighthouse CI
- Vercel Serverless Functions

## Requirements

- Node.js 24
- npm 10+

## Installation

```powershell
npm install
```

## Development

```powershell
npm run dev
```

Vite will show the local URL in the console. It will usually be:

```text
http://localhost:5173
```

## Scripts

```powershell
npm run dev            # Development server
npm run build          # Production build
npm run preview        # Build preview
npm run lint           # ESLint analysis
npm run format         # Formats the project with Prettier
npm run format:check   # Checks formatting without modifying files
npm run links:check    # Validates internal links, mailto links and content URLs
npm run quality        # Local pre-merge quality gate
npm run test           # Unit tests with Vitest
npm run test:watch     # Vitest in watch mode
npm run e2e            # Playwright tests against the production build
```

To also validate external links:

```powershell
$env:CHECK_EXTERNAL_LINKS='true'
npm run links:check
```

## Environment Variables

Copy `.env.example` to `.env` for local development and configure the required variables in Vercel for production.

```env
RESEND_API_KEY=replace_with_resend_api_key
CONTACT_TO_EMAIL=replace_with_contact_email
CONTACT_FROM_EMAIL=Portfolio Contact <onboarding@resend.dev>
TURNSTILE_ENABLED=false
TURNSTILE_SECRET_KEY=
TURNSTILE_EXPECTED_HOSTNAME=
VITE_TURNSTILE_SITE_KEY=
VITE_ENABLE_TURNSTILE=false
VITE_SENTRY_DSN=replace_with_sentry_dsn
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_SENTRY=false
```

Required in production:

- `RESEND_API_KEY`: Resend API key.
- `CONTACT_TO_EMAIL`: destination inbox.
- `CONTACT_FROM_EMAIL`: verified sender in Resend.

Optional:

- `TURNSTILE_ENABLED`: set to `true` only where the server should require Turnstile verification.
- `TURNSTILE_SECRET_KEY`: enables server-side Turnstile verification. Leave empty until the client widget and token submission are wired.
- `TURNSTILE_EXPECTED_HOSTNAME`: optional hostname check for successful Turnstile validations, for example `example.com`.
- `VITE_TURNSTILE_SITE_KEY`: public Turnstile site key used by the contact form widget. Required when `TURNSTILE_SECRET_KEY` is set.
- `VITE_ENABLE_TURNSTILE`: set to `true` only in the production deployment environment. Leave it `false` in local development and previews even if keys are present.
- `VITE_SENTRY_DSN`: enables Sentry in the frontend.
- `VITE_APP_VERSION`: release identifier for Sentry. CI sets this to the Git SHA.
- `VITE_ENABLE_ANALYTICS`: set to `true` only in the production deployment environment.
- `VITE_ENABLE_SENTRY`: set to `true` only where Sentry events should be sent.

## Content Editing

Most visible content is centralized in:

- `src/data/portfolio.json`

Edit that file to change the hero, navigation, experience, education, languages, projects, skills and contact details without touching component logic.

Content is validated with:

- `src/data/portfolioSchema.js`
- `src/data/portfolioSchema.test.js`

If a new section or required field is added, update the JSON, schema and tests at the same time.

## Styling Architecture

Each section owns its JSX and CSS in the same folder:

```text
src/components/Hero/Hero.jsx
src/components/Hero/Hero.css
src/components/Projects/Projects.jsx
src/components/Projects/Projects.css
```

Shared component styles are colocated with the shared component:

```text
src/components/shared/FadeIn/FadeIn.css
src/components/shared/SkillLogo/SkillLogo.css
```

Global styles are limited to:

- `src/styles/tokens.css`: design tokens.
- `src/styles/base.css`: document-level defaults.
- `src/styles/components.css`: reusable primitives such as tags, buttons and shared layout helpers.
- `src/styles/effects.css`: global cursor and scroll-progress effects.

Prefer component CSS for section-specific styles. Keep inline styles only for runtime values such as animation delays, CSS variables derived from data, progress values or pointer position.

## Static Assets

Public assets are loaded by URL from the component that needs them:

- `public/icons`: reusable SVG UI icons.
- `public/flags`: language flag SVGs.
- `public/profile_character.webp`: optimized hero character image.

Avoid embedding static SVG markup in components. Keep inline SVG only when it is generated from runtime data or requires interactive rendering, such as the project detail globe.

## Contact Form

The form sends messages through the serverless function:

- `api/contact.js`

Current validations:

- Allowed method: `POST`
- Required fields: name, email and message
- Email with valid format
- Optional attachment only in PDF
- Maximum attachment size: 2 MB, validated from decoded server-side bytes
- Best-effort per-IP rate limiting in the serverless function
- Honeypot field support
- Optional server-side Turnstile verification when `TURNSTILE_SECRET_KEY` is configured
- Optional Turnstile hostname validation when `TURNSTILE_EXPECTED_HOSTNAME` is configured
- Client-side Turnstile widget when `VITE_TURNSTILE_SITE_KEY` is configured
- Basic sanitization before building the email

## Quality Gates

Run before merge:

```powershell
npm run format:check
npm run lint
npm run links:check
npm run test
npm run build
npm run e2e
```

`npm run quality` covers the non-Playwright gates. Run `npm run e2e` separately because it builds and launches the preview server.

For a release candidate, run:

```powershell
npm run format
npm run quality
npm run e2e
```

Lighthouse CI enforces accessibility, best-practices and SEO thresholds, plus bundle budgets in `lighthouserc.json`:

- JavaScript: 180 KB
- CSS: 40 KB
- Images: 80 KB
- Fonts: 120 KB
- Total byte weight: 500 KB

Review dependencies periodically with:

```powershell
npm outdated
npm audit --audit-level=moderate
```

## CI

The `.github/workflows/ci.yml` workflow runs on every pull request and on pushes to `main`:

- `npm ci`
- `npm run format:check`
- `npm run lint`
- `npm run links:check`
- `npm run test`
- `npm run build`
- Chromium installation for Playwright
- `npm run e2e`
- Lighthouse CI

The workflow also sets `VITE_APP_VERSION` to the Git SHA so Sentry releases can be correlated with deployed commits when `VITE_SENTRY_DSN` is configured.

## Deployment

Pushes to `main` go through CI and then deploy the production build to Vercel.

Pull requests run the same quality job and then create a Vercel preview deployment when the Vercel secrets are available.

Configure these secrets in GitHub before the first deployment:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

You can get the org ID and project ID by linking the project locally once:

```powershell
npx vercel link
```

Then read `.vercel/project.json` and copy the values to GitHub Secrets. Do not upload the `.vercel` folder to the repository.

Branch protection is not managed as IaC in this repository. Configure it manually in GitHub:

1. Go to `Settings > Branches > Branch protection rules`.
2. Add a rule for `main`.
3. Require pull request reviews before merging.
4. Require status checks to pass before merging.
5. Select the `quality` workflow status check.
6. Require branches to be up to date before merging.
7. Restrict direct pushes to `main` for maintainers as needed.

## SEO

SEO assets are in `index.html`, `public/robots.txt`, `public/sitemap.xml` and `public/og-image.svg`.

Current coverage:

- Metadata description, keywords, robots and theme color
- Open Graph and Twitter card metadata
- Canonical and alternate links
- Sitemap and robots
- JSON-LD for `Person`, `WebSite` and portfolio `CreativeWork`
- Static `public/404.html` served by the Vite preview plugin for unknown routes

## Structure

```text
api/                                Contact form serverless function
public/                             Static assets, sitemap, robots and 404 page
public/icons/                       Static SVG icons loaded on demand
scripts/                            Maintenance utilities
src/App.jsx                         Main section composition
src/components/                     Components organized by section
src/components/shared/              Shared UI primitives
src/data/                           Editable JSON and Zod schema
src/hooks/                          Reusable UI hooks
src/services/                       Observability integrations
src/styles/                         Global tokens, base styles and shared primitives
src/test/                           Unit test setup
src/utils/                          Framework-independent helpers
tests/e2e/                          Playwright tests
```

# Portfolio

Portfolio personal built with React, Vite and Tailwind CSS.

## Stack

- React 19
- Vite 8
- Tailwind CSS 4
- Zod
- Vitest + Testing Library

## Requirements

- Node.js 24
- npm 10+

## Install

```powershell
npm install
```

## Development

```powershell
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

## Production build

```powershell
npm run build
```

## Preview build

```powershell
npm run preview
```

## Deployment

Pushes to `main` run CI and then deploy the production build to Vercel.

Configure these GitHub repository secrets before the first deploy:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

You can get the org and project IDs by linking the project locally once:

```powershell
npx vercel link
```

Then read `.vercel/project.json` and add the values as GitHub secrets. Do not commit the `.vercel` folder.

## Content editing

Most of the portfolio content is centralized in:

- `src/data/portfolio.json`

Edit that file to change the hero, skills, experience, education, projects, AI projects and contact details without touching component logic.

## Project structure

- `src/App.jsx` wires the sections together
- `src/components/` contains one folder per UI section, each with its component, optional tests and an `index.jsx` export
- `src/components/index.js` is the component barrel used by `App.jsx`
- `src/data/` contains the editable portfolio JSON and its Zod validation schema
- `src/hooks/` contains reusable React hooks
- `src/services/` contains integrations such as observability
- `src/utils/` contains framework-agnostic helpers for browser APIs and link safety
- `public/` contains static assets

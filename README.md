# Portfolio

Portfolio personal built with React, Vite and Tailwind CSS.

## Stack

- React 18
- Vite
- Tailwind CSS
- Framer Motion

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

## Content editing

Most of the portfolio content is centralized in:

- `src/data/portfolio.json`

Edit that file to change the hero, skills, experience, education, projects, AI projects and contact details without touching component logic.

## Project structure

- `src/App.jsx` wires the sections together
- `src/components/` contains the UI sections
- `src/data/portfolio.json` contains the editable content
- `public/` contains static assets

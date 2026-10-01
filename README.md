# Job Board App

A simple React + TypeScript job listing app for browsing, filtering, adding, editing, and deleting job posts. The app uses browser local storage to persist job data between refreshes.

## Features

- Browse a list of job cards
- Filter jobs by tags such as role, level, and technologies
- Add a new job using a popup form
- Edit any existing job
- Delete jobs from the card list
- Data persistence with localStorage
- Responsive layout for desktop and mobile

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS

## Project Structure

```bash
src/
├── App.tsx
├── components/
│   ├── FilterBar.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── JobCard.tsx
├── context/
│   └── FilterContext.tsx
├── data/
│   └── jobs.json
├── Types/
│   └── index.ts
├── index.css
├── main.tsx
└── vite-env.d.ts
```

## Getting Started

### Install dependencies

```bash
npm install
```

or

```bash
pnpm install
```

### Run the app

```bash
npm run dev
```

or

```bash
pnpm dev
```

### Build for production

```bash
npm run build
```

or

```bash
pnpm build
```

## Notes

This version uses localStorage instead of a backend, which makes it easy to run and test without extra setup. For a production-ready app, the next step would be connecting it to a real database or API.

## License

This project is intended for learning and demo purposes.

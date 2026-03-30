# 🎥 ProjSim

**ProjSim** is a fast, interactive projector brightness simulator for comparing two projectors side by side.

It helps you answer practical questions like:

- Will this projector be bright enough for my screen size?
- How much does ambient light affect the image?
- Which of two models will look better in my room?

## What it does

ProjSim lets you:

- compare two projectors in real time
- adjust screen size, throw distance, viewing distance, and room lighting
- see brightness in **foot-lamberts**, **nits**, and a relative visual brightness score
- preview differences visually with scene-based comparisons
- apply preset scenarios for quick experimentation
- share a setup with URL parameters and export comparison details

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Radix UI / shadcn-style components

## Getting started

The app lives in `/app`.

### Install dependencies

```bash
cd app
npm install
```

### Start the development server

```bash
cd app
npm run dev
```

### Build for production

```bash
cd app
npm run build
```

## Netlify deployment

This repository includes a root-level `netlify.toml` configured to:

- use `app` as the base directory
- run `npm run build`
- publish `app/dist`

That means Netlify can deploy the app directly from this repository without needing manual build settings.

## Project structure

```text
.
├── app/        # React + Vite application
├── assets/     # Static built assets checked into the repo
└── index.html  # Root HTML entry point for the built site
```

## Why it’s useful

ProjSim is designed for home theater planning, quick projector comparisons, and sharing realistic brightness expectations before you buy or install hardware.

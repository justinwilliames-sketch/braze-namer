# Orbit Namer

Generate consistent naming conventions for any Braze asset — Canvases, campaigns, segments, templates, and Content Blocks. Includes smart tag recommendations based on your selections.

An [Orbit](https://yourorbit.team) web app.

## Features

- Configurable dimension-based naming: asset type, channel, program, audience, country, language, version, step, variant, date
- Smart tag recommendations based on selection combinations
- Region and localisation tags derived from country/language
- Cross-dimensional combo tags (e.g., dunning + email = revenue recovery)
- Customisable fields and values (logged-in users)
- System dark/light mode

## Setup

```bash
npm install
npm run dev
```

Requires `DATABASE_URL` environment variable for PostgreSQL (user persistence).

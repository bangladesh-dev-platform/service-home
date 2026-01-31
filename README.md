# banglade.sh - Service Home

The main frontend portal for **banglade.sh** - a Bangladesh-focused super-portal similar to Naver.com or Yahoo Japan.

**Live:** https://banglade.sh

## Overview

Service Home is the central hub providing Bangladeshi users with localized news, weather, jobs, education, prayer times, entertainment, and AI assistance - all in one place.

## Features

### Homepage Widgets

| Widget | Description |
|--------|-------------|
| **Prayer Times** | Daily prayer schedule with location detection, next prayer countdown |
| **Weather** | Current weather for all 8 divisions, detailed forecasts |
| **News** | Latest headlines from Prothom Alo, Kaler Kantho with filtering |
| **Cricket** | Live scores for Bangladesh matches |
| **Jobs** | Government, private, NGO job listings |
| **Education** | Admissions, exam results, scholarships, notices |
| **Currency** | USD, EUR, GBP, INR, SAR exchange rates |
| **Stock Market** | DSE/CSE indices, top gainers/losers |
| **Commodities** | Gold, silver, fuel prices |
| **Emergency** | Police, fire, ambulance, utility contacts |
| **Holidays** | National holidays with countdown |
| **Radio** | Bangladeshi radio stations streaming |
| **AI Assistant** | GPT-powered chat in Bengali & English |

### Pages

- `/` - Homepage with all widgets
- `/news` - Full news page with source & category filters
- `/jobs` - Job listings with type filters (govt/private/NGO)
- `/education` - Education resources by type & level
- `/weather` - Detailed weather for all locations

### App Directory

36 current apps + 43 planned apps covering:
- Daily essentials (prayer, weather, news)
- Finance (currency, market, banking)
- Services (jobs, education, government)
- Entertainment (cricket, radio, videos)
- Utilities (emergency, transport, health)

### AI Assistant

- Powered by OpenAI GPT-4o-mini
- Supports Bengali and English
- Creative prompts: poetry, stories, local recommendations
- Rate limited: 5/day (guest), 20/day (authenticated)

## Tech Stack

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **PWA:** vite-plugin-pwa + Workbox
- **State:** React Context + Hooks
- **API Client:** Fetch with custom wrapper

## Project Structure

```
src/
├── components/
│   ├── common/          # Shared components (Logo, etc.)
│   ├── layout/          # Header, Footer
│   ├── pwa/             # Install/Update prompts
│   └── sections/        # Homepage widgets
├── context/             # PWA context
├── hooks/               # Custom hooks (geolocation)
├── pages/               # Route pages
├── services/            # API client
└── utils/               # Bangla utilities
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create `.env.local`:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## API Integration

All data comes from `service-api`. See [API Documentation](../service-api/docs/API.md).

Key endpoints used:
- `GET /portal/weather` - Weather data
- `GET /portal/news` - News feed
- `GET /portal/jobs` - Job listings
- `GET /portal/education` - Education resources
- `GET /portal/prayer` - Prayer times
- `GET /portal/cricket` - Cricket scores
- `POST /portal/ai/chat` - AI assistant

## PWA Features

- **Offline Support:** Service worker caches assets and API responses
- **Installable:** Add to home screen on mobile/desktop
- **Auto Update:** Prompts user when new version available
- **Icons:** Adaptive icons for all platforms

## Localization

- UI supports both Bengali and English
- Bengali number conversion utilities
- Bengali date formatting
- Bilingual content (titles, labels)

## Docker

```bash
# Build image
docker build -t service-home .

# Run container
docker run -p 3000:80 service-home
```

## Related Services

| Service | Port | Description |
|---------|------|-------------|
| service-api | 8080 | Backend API |
| service-auth | 8081 | Authentication |
| service-youtube | 5173 | Video platform |
| platform-infra | 80/443 | Traefik, Postgres, Redis |

## Contributing

1. Create feature branch from `main`
2. Make changes
3. Test locally with `npm run dev`
4. Submit PR

## License

Private - Bangladesh Dev Platform

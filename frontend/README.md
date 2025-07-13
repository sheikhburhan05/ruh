# Wellness Platform Frontend

A modern web application for managing wellness appointments and client relationships. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Client Management**
  - View and search clients
  - Add new clients
  - Paginated client list
  - Real-time search functionality

- **Appointment Management**
  - Schedule new appointments
  - View and filter appointments
  - Update appointment status (Scheduled, Confirmed, Completed, Cancelled)
  - Date range filtering
  - Status filtering
  - Notes and client association
  - Paginated appointment list

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_BE_URL=http://localhost:8000
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js app router pages
│   ├── appointments/      # Appointments page
│   ├── clients/          # Clients page
│   └── layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── ui/              # UI components
│   └── ...              # Other components
├── lib/                  # Utilities and helpers
│   ├── api.ts           # API client and types
│   └── contexts/        # React contexts
├── styles/              # Global styles
└── types/               # TypeScript type definitions
```

## API Integration

The frontend integrates with a RESTful API with the following endpoints:

### Clients
- `GET /api/v1/clients` - List clients (with pagination)
- `POST /api/v1/clients` - Create a new client
- `GET /api/v1/clients/:id` - Get client details

### Appointments
- `GET /api/v1/appointments` - List appointments (with pagination and filters)
- `POST /api/v1/appointments` - Create a new appointment
- `PUT /api/v1/appointments/:id` - Update an appointment
- `GET /api/v1/appointments/:id` - Get appointment details

Query Parameters for Appointments:
- `search`: Search appointments
- `start_date`: Filter by start date (YYYY-MM-DD)
- `end_date`: Filter by end date (YYYY-MM-DD)
- `status`: Filter by status (scheduled/confirmed/completed/cancelled)
- `page`: Page number
- `page_size`: Items per page

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Code Style

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type checking

# Virtual Wellness Platform

A fullstack application for managing wellness clinic clients and appointments, featuring a modern web interface for scheduling and managing appointments and client relationships.

## Features

- **Client Management**
  - View and search clients
  - Add new clients
  - Paginated client list
  - Real time search functionality

- **Appointment Management**
  - Schedule new appointments
  - View and filter appointments by date range and status
  - Update appointment status (Scheduled, Confirmed, Completed, Cancelled)
  - Add notes and client associations
  - Paginated appointment list

- **Authentication & Security**
  - Auth0 Integration for secure authentication
  - Protected API routes and frontend pages
  - Role based access control
  - Secure session management
  - User profile management

## Tech Stack

### Backend
- Python FastAPI (3.11+) - Modern, fast web framework for building APIs
- PostgreSQL - Robust relational database
- SQLAlchemy (ORM) - Database interaction and management
- Pydantic - Data validation and settings management
- Alembic - Database migration tool
- Auth0 - Authentication and authorization provider

### Frontend
- Next.js 14 (App Router) - React framework with server side rendering
- TypeScript - Type-safe JavaScript
- Tailwind CSS - Utility-first CSS framework
- shadcn/ui - Accessible and customizable UI components
- React Context - State management
- Axios - HTTP client
- Auth0 React SDK - Authentication management

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL
- npm or yarn

### Backend Setup

1. Create and activate a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Unix/macOS
# or
.venv\Scripts\activate  # On Windows
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory:
```env
# Database Configuration
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_HOST=
DATABASE_NAME=
DATABASE_PORT=

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://ruh-fe.s3-website-us-east-1.amazonaws.com"]

# Auth0 Configuration
AUTH0_AUDIENCE=
AUTH0_DOMAIN=
AUTH0_ISSUER=
AUTH0_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
```

4. Configure Database:
   - Update database configuration in `app/core/config.py` if needed
   - Default configuration uses:
     - Host: postgresql-199561-0.cloudclusters.net
     - Port: 16348
     - Database: ruh

5. Run migrations:
```bash
PYTHONPATH=$PYTHONPATH:. alembic upgrade head
```

6. Start the backend server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`. Visit `/docs` for the Swagger UI documentation or `/redoc` for ReDoc documentation.

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
# or
yarn install
```

2. Create a `.env.local` file in the frontend directory:
```env
# API Configuration
NEXT_PUBLIC_BE_URL=http://52.44.17.108

# Auth0 Configuration
NEXT_PUBLIC_CALLBACK=
NEXT_PUBLIC_AUTH0_CLIENT_ID=
NEXT_PUBLIC_AUTH0_DOMAIN=
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`.

## Project Structure

```
.
├── backend/               # FastAPI application
│   ├── alembic/          # Database migration files
│   ├── app/              
│   │   ├── api/          # API routes and endpoints
│   │   ├── core/         # Core configurations and auth
│   │   ├── db/           # Database models and session
│   │   ├── schemas/      # Pydantic models
│   │   └── services/     # Business logic
│   └── requirements.txt  # Python dependencies
│
├── frontend/             # Next.js application
    ├── app/             # App router pages
    │   ├── appointments/
    │   ├── clients/
    │   ├── profile/     # User profile management
    │   └── logout/      # Logout handling
    ├── components/      # Reusable UI components
    │   ├── auth-guard.tsx  # Authentication protection
    │   └── ui/          # UI components
    ├── lib/             # Utility functions and API client
    │   └── contexts/    # React contexts including Auth0
    └── types/           # TypeScript types
```

## API Integration

The platform provides the following API endpoints:

### Authentication
- `/api/auth/login` - Redirect to Auth0 login
- `/api/auth/logout` - Handle logout
- `/api/auth/callback` - Auth0 callback handling
- `/api/auth/me` - Get user profile

You can use the following testing credentials to login:
- Email: sheikhburhan055@gmail.com
- Password: Test@123

Alternatively, you can continue with Google for login, it auto create new account.

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

Frontend:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

Backend:
- Database migrations:
  ```bash
  # Generate new migration
  PYTHONPATH=$PYTHONPATH:. alembic revision --autogenerate -m "Migration description"
  # Apply migrations
  PYTHONPATH=$PYTHONPATH:. alembic upgrade head
  # Rollback last migration
  PYTHONPATH=$PYTHONPATH:. alembic downgrade -1
  ```

## Assumptions & Design Decisions

1. Business Logic:
   - All dates are stored and handled in UTC
   - User authentication and authorization through Auth0

2. Technical Decisions:
   - Server-side rendering for better SEO and initial load performance
   - Type safety across the full stack (TypeScript + Pydantic)
   - Modern UI components with shadcn/ui
   - ESLint and Prettier for code consistency
   - Auth0 for secure authentication and authorization
   - Protected routes and API endpoints

## Implemented Extra Features

1. **Authentication & Authorization**
   - ✅ JWT based auth through Auth0
   - ✅ Role based access control
   - ✅ Session management
   - ✅ User profile management
   - ✅ Protected routes and API endpoints
   - ✅ Multi factor authentication support

## Future Improvements

1. Feature Enhancements
   - Real time updates using WebSocket
   - Email notifications for appointments
   - Calendar integration
   - Automated appointment reminders

2. Technical Improvements
   - Comprehensive test coverage
   - Mobile responsive design optimization
   - Performance monitoring and analytics
   - CI/CD pipeline setup

## Time Tracking

Total time spent: 7 hours

Breakdown:
- Initial setup and project structure: 1 hour
- Backend development: 2 hours
- Frontend development: 2 hours
- Auth0 Integration: 1 hour
- Testing and bug fixes: 0.5 hours
- Documentation: 0.5 hours

## Deployment

Currently running locally. To deploy this application:

1. Backend:
   - Deployed to a AWS cloud provider EC2 (http://52.44.17.108)
   - Protected by Auth0 authentication
   - API endpoints secured with JWT validation

2. Frontend:
   - Deployed to AWS S3 (http://ruh-fe.s3-website-us-east-1.amazonaws.com)
   - Set up CDN for static assets
   - Auth0 configuration for production environment 
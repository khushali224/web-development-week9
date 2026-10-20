# Launchpad — Week 9 React Job & Internship Portal

Launchpad is a responsive React frontend for a job and internship portal. It demonstrates reusable components, routed pages, React hooks, API integration, candidate authentication, protected pages, search/filter controls, and application tracking.

## Features

- Responsive home page, job search, job details, sign-in, registration, candidate dashboard, profile, and applications pages.
- Reusable job cards, buttons, form fields, loader, error message, and application modal.
- React Router routes, including the dynamic `/jobs/:id` route and protected candidate pages.
- React `useState` for form, filter, loading, and application state; `useEffect` for API data loading; `useContext` for shared authentication.
- Axios API client with bearer-token injection, visible API errors, favorites, and backend pagination.
- Application form validation for email, phone, PDF resume URL/filename, and cover letter.
- Local demo mode when `VITE_API_URL` is not set. Demo accounts and applications are stored in this browser only.

## Tech stack

React 18, Vite 6, React Router 6, Axios, Lucide React, CSS.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
Copy-Item .env.example .env
# Edit .env and set VITE_API_URL to your Week 8 backend origin
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`). To create a production build, run `npm run build`; use `npm run preview` to preview the built site.

If you leave `VITE_API_URL` unset, Launchpad uses sample opportunities and browser-local demo authentication/applications. This is for exploration and screenshots only; it is not server authentication. A configured API is never silently replaced with demo data when a request fails.

## Environment variables

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_API_URL` | Week 8 API origin (no trailing slash required) | `http://localhost:5000` |

The backend must allow the Vite development origin through CORS. After changing `.env`, restart Vite.

## API integration

With `VITE_API_URL` configured, the client uses:

| Method | Endpoint | Use |
| --- | --- | --- |
| `GET` | `/api/jobs` | Listing and filter query parameters (`search`, `location`, `type`, `category`, `page`, `limit`) |
| `GET` | `/api/jobs/:id` | Job details |
| `POST` | `/api/auth/register` | Registration (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Login (`email`, `password`) |
| `GET` | `/api/auth/me` | Restore the current session |
| `POST` | `/api/applications` | Submit a job application |
| `GET` | `/api/applications/my` | Candidate application history |

Login expects a JSON response containing `token` (or `accessToken`) and `user`; the current-user endpoint may return a user directly or under `user`. Jobs may be returned as an array, `{ "jobs": [...] }`, or `{ "data": [...] }`. The application submit request is `multipart/form-data` and includes `jobId`, candidate name/email/phone, a PDF `resume` file, and `coverLetter`. Align response/payload shapes in `src/context/AuthContext.jsx` and `src/services/api.js` if your Week 8 API differs.

## Project structure

```text
src/
├── components/   # Reusable UI
├── context/      # Auth context
├── pages/        # Route screens
├── routes/       # Protected route
├── services/     # Axios client and demo data
├── App.jsx
├── index.css
└── main.jsx
```

## Screenshots

Screenshots are captured from the running app and included in the project documents:

- `screenshots/home-desktop.png`
- `screenshots/jobs-desktop.png`
- `screenshots/job-details-desktop.png`
- `screenshots/login-desktop.png`
- `screenshots/register-desktop.png`
- `screenshots/application-form.png`
- `screenshots/dashboard-desktop.png`
- `screenshots/home-mobile.png`
- `screenshots/jobs-mobile.png`

## Deliverables

- `docs/Week-9-React-Job-Portal-Report.docx` — ten-page project report with screenshots.
- `docs/Week-9-React-Job-Portal-Presentation.pptx` — nine-slide presentation with screenshots.
- `docs/LinkedIn-Post.md` — ready-to-personalize project announcement.

## Notes

The report and slide deck are project documentation, not evidence of an external backend being available. Before submission, connect and test against your Week 8 API, replace the sample screenshots if your live data differs, and add your own name, GitHub repository URL, and any required institutional details.

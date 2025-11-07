# ResuAI – AI-Powered Resume Analyzer and LinkedIn Bio Generator

ResuAI is a production-grade MERN + Go microservice application that lets users:

- Upload their resume (PDF/DOC/TXT)
- Get an AI-generated ATS score and improvement suggestions
- Generate a professional LinkedIn bio from their resume
- Save results to a dashboard
- Upgrade to a paid plan for unlimited scans (Razorpay)

## Tech Stack

- Frontend: React + Vite, TailwindCSS, shadcn/ui (generated primitives), Framer Motion, Lucide, Lottie, Axios, React Router
- Backend: Node.js (Express API gateway), MongoDB (Atlas), Firebase Auth (Google/email), Razorpay, Cloud storage (Cloudinary or S3)
- Microservice: Go (resume parsing + keyword analysis)
- AI: OpenAI (or Gemini) for suggestions and bio

## Monorepo Structure

- frontend/ – Vite React app
- backend/ – Express API gateway
- microservices/resumeParser – Go HTTP service
- docs/ – Postman collection and assets

## Quick Start (Local)

Prereqs: Node 18+, Go 1.21+, Docker (optional), MongoDB Atlas (or local), Firebase service account.

1. Copy envs

```sh
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Start dev services

- Start Go microservice
```sh
cd microservices/resumeParser
go run .
```
- Start backend
```sh
cd backend
npm i
npm run dev
```
- Start frontend
```sh
cd frontend
npm i
npm run dev
```

3. Open http://localhost:5173

## Docker Compose (Backend + Parser + Mongo)

```sh
docker compose up --build
```
Frontend runs separately with `npm run dev` in `frontend/`.

## Deployment

- Frontend → Vercel
- Backend → Railway/Fly.io
- DB → MongoDB Atlas
- Microservice → Railway/Fly.io

## Scripts

See package.json in each app. Backend and frontend include linting and formatting.

## License

MIT

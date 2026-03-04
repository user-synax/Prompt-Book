# Vercel Live Upload Checklist (Frontend) + Backend Setup

## 1) Local env setup

Create and verify local env files:

- `backend/.env`
- `frontend/.env.local`

Backend variables required:

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `OPENAI_API_KEY`
- `FRONTEND_URL`

Frontend variable required:

- `NEXT_PUBLIC_API_URL`

## 2) Pre-deploy validation

From repo root:

```bash
cd backend && npm run typecheck
cd ../frontend && npm run lint
```

## 3) Deploy backend (Railway/Render/Fly)

Use `backend` folder as service root.

- Build command: `npm run build`
- Start command: `npm run start`

Add backend env vars in host dashboard (same as `backend/.env`).

After deployment, copy backend URL:

- Example: `https://your-backend.example.com/api`

## 4) Deploy frontend on Vercel

- Import repo into Vercel.
- Set Root Directory to `frontend`.
- Add env var in Vercel project:
  - `NEXT_PUBLIC_API_URL=https://your-backend.example.com/api`
- Redeploy.

## 5) Final production wiring

Update backend `FRONTEND_URL` in your backend host to your Vercel URL:

- `https://your-app.vercel.app`

Redeploy backend after changing this value.

## 6) Smoke test

- Register/login
- Create prompt
- Edit prompt
- Toggle public
- Open `/public-prompts`

If cookies/auth fail, re-check CORS domain and exact `NEXT_PUBLIC_API_URL`.

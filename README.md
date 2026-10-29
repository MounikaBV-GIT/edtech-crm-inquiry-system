## Live Demo

**Live Website:** https://edtech-crm-inquiry-system-vxwg.vercel.app/

**Backend Health Check:** https://edtech-crm-inquiry-system.onrender.com/api/health/

# EdTech CRM & Inquiry System

Full-stack assessment implementation:
- Frontend: React + Vite + plain CSS
- Backend: Python, Django, Django REST Framework
- Database: Supabase PostgreSQL
- Custom admin authentication: bcrypt password hashes + signed JWTs (not Supabase Auth)

## Features
- Public inquiry form (Parent/Student/School; Scholarship/Concert/Admission/General Query)
- Admin login and JWT-protected dashboard
- Inquiry table, status updates, category and user-type filters, name/phone search
- SQL schema, environment example, CORS setup

## Project structure
```text
edtech-crm-inquiry-system/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── config/
│   └── inquiries/
│       ├── management/commands/create_admin.py
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       └── urls.py
├── frontend/
│   ├── .env.example
│   ├── package.json
│   ├── index.html
│   └── src/
└── schema.sql
```

## Requirements
- Python 3.11+ recommended
- Node.js 20+ recommended
- A Supabase project with a PostgreSQL database

## 1. Configure Supabase
1. Create a project at https://supabase.com.
2. In the project dashboard, open **Connect** and copy the PostgreSQL connection string (use the direct connection or session pooler appropriate to your network/deployment).
3. Run `schema.sql` in Supabase SQL Editor. The first Django migration is included; use `python manage.py migrate --fake-initial` so Django recognizes the tables that the SQL script created.
4. Keep the database password private. Do not commit `.env`.

The Django models use `inquiries` and `admins` tables created by `schema.sql`. Django's built-in auth tables are not required for this app. If using `python manage.py migrate`, Django will also create its normal framework tables.

## 2. Run the backend (Windows CMD)
```bat
cd backend
py -m venv venv
venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
copy .env.example .env
```
Edit `backend/.env`:
- `DATABASE_URL`: Supabase PostgreSQL connection URI
- `SECRET_KEY`: long random Django secret
- `JWT_SECRET`: a separate long random secret
- `FRONTEND_ORIGIN`: `http://localhost:5173`

Then run:
```bat
python manage.py check
python manage.py migrate --fake-initial
python manage.py create_admin
python manage.py runserver
```
The create-admin command prompts for username and password, hashes the password with bcrypt, and stores it in the `admins` table. Do not use a weak password.

Backend runs at `http://127.0.0.1:8000`.

## 3. Run the frontend (second CMD window)
```bat
cd frontend
npm install
copy .env.example .env
npm run dev
```
The frontend runs at `http://localhost:5173`. The frontend `.env` should contain:
`VITE_API_BASE_URL=http://127.0.0.1:8000/api`

## 4. Test the app
1. Open `http://localhost:5173` and submit an inquiry.
2. Click Admin Login and use the admin credentials created with `create_admin`.
3. Confirm the inquiry appears in the dashboard.
4. Test category, user-type, and name/phone search filters.
5. Change an inquiry's status and confirm it updates.
6. Log out and verify the dashboard is no longer accessible without logging in.
7. API endpoints:
   - `POST /api/inquiries/` — public inquiry submission
   - `POST /api/auth/login/` — admin login, returns JWT
   - `GET /api/admin/inquiries/` — protected list with optional `category`, `user_type`, `search`
   - `PATCH /api/admin/inquiries/<id>/` — protected status update
   - `GET /api/health/` — health check

## 5. Deploy
### Backend on Render
1. Push this repository to GitHub.
2. Create a Render **Web Service** from the repository.
3. Set the root directory to `backend`.
4. Build command: `pip install -r requirements.txt && python manage.py migrate`
5. Start command: `gunicorn config.wsgi:application`
6. Add environment variables from `.env.example`; set `DEBUG=False`, `ALLOWED_HOSTS` to your Render hostname, `FRONTEND_ORIGIN` to your deployed frontend origin, and use the Supabase `DATABASE_URL`.
7. Create the admin using Render Shell: `python manage.py create_admin`.
8. If your Supabase database requires SSL, the connection URL code enables `sslmode=require` when no SSL mode is specified.

### Frontend on Vercel
1. Import the same GitHub repository into Vercel.
2. Set root directory to `frontend`.
3. Add `VITE_API_BASE_URL=https://YOUR-RENDER-SERVICE.onrender.com/api`.
4. Deploy and update the backend `FRONTEND_ORIGIN` to your Vercel URL.

## Security notes
- Never commit `.env`, real database credentials, or JWT secrets.
- This assessment uses a custom JWT implementation, not Supabase Auth.
- JWTs expire after 8 hours. The demo stores the token in sessionStorage; for production, consider HttpOnly secure cookies, rate limiting, HTTPS, stronger operational controls, and audit logging.
- Configure `ALLOWED_HOSTS` and `FRONTEND_ORIGIN` for the deployed domains.

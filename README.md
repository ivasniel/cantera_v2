# La Cantera Soccer Academy — New Website

Fresh full-stack starter built from scratch with:

- Angular 22 frontend
- Node.js 24 LTS + Express 5 backend
- Responsive homepage based on the approved redesign
- Working quick-registration form
- Programs loaded from the Node API
- Temporary local image assets that are easy to replace later

## Requirements

- Node.js 24.15+ (24 LTS recommended)
- npm 11+

## 1. Run the backend

```bash
cd backend
npm install
npm run dev
```

Backend: `http://localhost:3000`

## 2. Run the Angular frontend

Open another terminal:

```bash
cd frontend
npm install
npm start
```

Frontend: `http://localhost:4200`

Angular proxies `/api` requests to the Node server during development.

## Homepage behavior

- Header navigation scrolls to the correct section.
- Mobile navigation opens/closes from a menu button.
- `Register Parent` scrolls to Quick Registration.
- `Add Player` and `Pay Online` guide new users to create/sign in to a parent account first.
- Program cards can be selected; the selected program is sent with the parent lead.
- Quick Registration validates name, email, and phone.
- Successful registration is persisted to `backend/data/registration-leads.json`.
- The API returns the three program cards displayed on the homepage.

## Important

This is Phase 1: the public homepage and first-contact registration flow. It intentionally does **not** include authentication, player records, Stripe payments, recurring billing, admin management, or a real database yet. Those should be added next instead of mixing them into the homepage.

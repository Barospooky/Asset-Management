# Asset Management System

This Express + PostgreSQL project manages employees, assets, stock, issuing, returns, scraps, and history.

## Suggested improvement areas

- Security: protect all business routes behind login, move secrets to environment variables, harden session cookies, add rate limiting, switch destructive actions to `POST`, and validate every form on the server.
- Validation: enforce unique emails and serial numbers, valid status transitions, positive numeric ids, date sanity checks, and max lengths on all free-text fields.
- UI and UX: add a consistent design system, stronger information hierarchy, clearer feedback messages, searchable tables, and mobile-friendly forms.
- Structure: separate middleware, validators, and route helpers so business rules are easier to maintain and safer to reuse.
- Auditability: keep asset history complete for every issue, return, and scrap action, with user attribution once real accounts are added.

## Environment setup

1. Copy `.env.example` to `.env`.
2. Fill in the database values.
3. Set `SESSION_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
4. Run `npm start`.

## Deployment

This app is ready for a Node host such as Render or Railway.

1. Provision a PostgreSQL database.
2. Add the environment variables from `.env.example` in the deployment dashboard.
3. Set the start command to `npm start`.
4. Make sure `NODE_ENV=production` so secure cookie settings are applied.
5. Update the database host, user, password, and database name with the managed Postgres values.

## Next recommended upgrades

- Replace the single admin login with a real `users` table and hashed passwords.
- Add CSRF protection for every form.
- Add automated tests for route validation and asset lifecycle rules.
- Add a dashboard with totals, low-stock alerts, and recent activity.

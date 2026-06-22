# Implementation Notes

This codebase focuses on a practical launch-ready MVP rather than fake placeholder code. It includes database-backed APIs, role protection, validation, and a frontend that covers the major product journeys.

## Roles

- `admin`: full platform control.
- `hbt_admin`: manages assigned Home Buying Team partnerships and employees.
- `hbt_member`: supports assigned team messages and employee follow-up.
- `employee`: uses the branded portal, resources, quizzes, and messaging.

## Important security defaults

- JWT is required for protected routes.
- Passwords are hashed with bcryptjs.
- Authentication and contact endpoints are rate limited.
- Helmet is enabled.
- Production CORS must be restricted with `CORS_ORIGIN`.
- File uploads are limited to CSV MIME/extension checks and max file size.

## Known production upgrades

- Add refresh tokens and token rotation.
- Add email verification and password reset emails.
- Add OpenAPI generation with examples.
- Add audit log UI.
- Add employer aggregate analytics dashboard.
- Add Playwright E2E tests and GitHub Actions.

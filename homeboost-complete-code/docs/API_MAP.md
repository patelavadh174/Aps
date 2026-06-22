# HomeBoost API Map

Base URL: `/api`

## Public

- `GET /health` - API health check.
- `GET /public-partnerships/:slug` - employer-branded public portal.
- `GET /pricing` - active pricing plans.
- `GET /faqs` - active FAQs.
- `POST /contact` - submit contact inquiry.

## Auth

- `POST /auth/signup` - create employee account.
- `POST /auth/login` - login and receive JWT.
- `GET /auth/me` - current authenticated user.

## Employee

- `GET /employee-portal/dashboard` - employee dashboard summary.
- `GET /resources` - resources visible to current role.
- `GET /quizzes/active` - active quiz with questions/options.
- `POST /quizzes/:quizId/submit` - submit quiz answers.
- `GET /messages/my-thread` - employee message thread.
- `POST /messages/my-thread` - create employee thread.

## HBT/Admin Operations

- `GET /users` - list users.
- `PATCH /users/:id` - update user role/status/team/partnership.
- `GET /hbts` / `POST /hbts` - manage Home Buying Teams.
- `GET /partnerships` / `POST /partnerships` - manage employer partnerships.
- `POST /enrollment/upload` - upload employee CSV.
- `POST /enrollment/batches/:id/revoke` - revoke CSV batch.
- `GET /messages/threads` - list message threads by role.
- `POST /messages/threads/:threadId/replies` - send a message reply.
- `GET /quizzes/submissions` - review quiz submissions.

## Admin CMS

- `GET/POST /pages`
- `GET/POST /resources`
- `GET/POST /pricing`
- `GET/POST /faqs`
- `GET /contact` - list contact messages.

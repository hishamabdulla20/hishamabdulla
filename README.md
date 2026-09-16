# Hisham Abdulla Portfolio

Personal portfolio built with Next.js App Router, React, TypeScript, and an optional Supabase backend. Without Supabase variables the public site safely uses the original content in `src/data/portfolio.ts`.

## Architecture

- Public portfolio content is fetched in a Server Component and rendered on the server.
- Published content is readable through the Supabase anonymous key and Row Level Security (RLS).
- Supabase Auth protects `/admin`; only users listed in `admin_users` are authorized.
- Admin Server Actions re-check both authentication and authorization before every write.
- Contact submissions go through `/api/contact`, with server validation, bot checks, rate limiting, and server-only database access.
- Validated admin uploads go through `/api/admin/upload` into the public `portfolio-assets` bucket.
- The service-role key is used only in server modules and must never have a `NEXT_PUBLIC_` prefix.

## Supabase setup

1. Create a Supabase project.
2. Apply [`supabase/migrations/20260916000000_initial_backend.sql`](supabase/migrations/20260916000000_initial_backend.sql) with `supabase db push` or the Supabase SQL editor. It creates the schema, indexes, RLS policies, storage bucket, and seed content.
3. In Supabase Authentication, create the admin user manually. Public sign-up is not part of this application.
4. Authorize that user using its UUID:

```sql
insert into public.admin_users (user_id)
values ('the-auth-user-uuid');
```

5. Copy `.env.example` to `.env.local` and fill in the project URL, anonymous key, service-role key, and a long random contact-rate-limit secret.

The database includes profile, projects, skill groups, education/experience/current-focus entries, articles, social links, site settings, and private contact messages. Article categories and tags are stored directly on articles because separate taxonomy tables would add complexity without helping this portfolio yet.

## Admin

Run the app and open `/admin/login`. The dashboard provides:

- project, article, and skill-group management;
- profile, social-link, education, experience, and current-focus management;
- protected contact-message review;
- validated image and PDF uploads.

Deleting content is permanent. Draft projects, articles, skill groups, and journey entries are visible in the admin but excluded from the public site.

## Development

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run start
```

## Quality checks

```bash
npm run lint
npm run typecheck
```

There is currently no automated test suite in the project.

## Production deployment

Deploy as a Next.js application (for example, on Vercel) and configure the same four environment variables in the hosting provider. Do not expose `SUPABASE_SERVICE_ROLE_KEY` or `CONTACT_RATE_LIMIT_SECRET` to the browser. Apply database migrations before directing production traffic to the new deployment.

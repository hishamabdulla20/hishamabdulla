# Hisham Abdulla Portfolio

Personal portfolio built with Next.js App Router, React, TypeScript, and an optional Supabase backend. Without Supabase variables the public site safely uses the original content in `src/data/portfolio.ts`.

## Architecture

- Public portfolio content is fetched in a Server Component and rendered on the server.
- Published content is readable through the Supabase anonymous key and Row Level Security (RLS).
- Supabase Auth protects `/admin`; only users listed in `admin_users` are authorized.
- Admin Server Actions re-check both authentication and authorization before every write.
- Contact submissions go through `/api/contact`, with server validation, bot checks, rate limiting, private Supabase storage, and server-side email delivery through Resend's HTTP API.
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

Deploy as a Next.js application (for example, on Vercel) and configure the variables below in the hosting provider. Do not expose server secrets with `NEXT_PUBLIC_` prefixes. Apply database migrations before directing production traffic to the deployment.

## Contact email setup

The contact endpoint previously only stored messages in `/admin/messages`; it did not send email. Its original "Contact is temporarily unavailable" response meant the Supabase client or rate-limit secret was not configured. Local `.env.local` values are not automatically copied to Vercel.

The form now validates and trims input, preserves the existing three-messages-per-IP-per-15-minutes database rate limit, stores a private inbox copy, and requests email delivery from Resend. Resend's HTTPS API is preferred here because Vercel recommends an email API rather than direct SMTP for serverless functions. The Hostinger mailbox remains the destination inbox; it does not need to expose its password to this application. The email contains Name, Email, Subject, and Message as plain text. `Hisham Abdulla <CONTACT_FROM_EMAIL>` is used for From; the visitor is Reply-To. Success is returned only after Resend acknowledges the email. Provider acceptance is not proof of inbox delivery: check Resend's delivery events and the recipient's spam folder.

| Variable | Purpose and source | Secret? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Existing Supabase project's URL, from its Connect dialog/project settings | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Existing project's anonymous API key, from Supabase API settings | No; protected by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Matching project's service-role key, from Supabase API settings | Yes |
| `CONTACT_RATE_LIMIT_SECRET` | Keep the existing private random value; generate one with `openssl rand -hex 32` only if absent | Yes |
| `RESEND_API_KEY` | Create a sending-access key in Resend → API Keys, scoped to the sending domain | Yes |
| `CONTACT_FROM_EMAIL` | `hisham@hishamabdulla.com`, after verifying its domain in Resend | Server-only configuration |
| `CONTACT_TO_EMAIL` | `hisham@hishamabdulla.com`, your Hostinger inbox | Private server-only configuration |

1. In [Resend → Domains](https://resend.com/domains), add a domain or sending subdomain you control. Add the exact DNS records shown by Resend at your DNS provider, and wait for verification. Do not replace the portfolio's web hosting records or existing inbox MX records. See [Resend domain setup](https://resend.com/docs/dashboard/domains/introduction).
2. In [Resend → API Keys](https://resend.com/api-keys), create a sending-access key for that verified domain. Put it in `RESEND_API_KEY`; never paste it into browser code or Git.
3. Set `CONTACT_FROM_EMAIL` to a sender on that verified domain and `CONTACT_TO_EMAIL` to your inbox. Use bare addresses, without display names or comma-separated recipients. No addresses are hard-coded.
4. Add all seven settings to `.env.local` for local testing. The file is ignored by Git. Preserve its existing values; do not overwrite it with `.env.example`.
5. In **Vercel → Project → Settings → Environment Variables**, add/check all seven for **Production**. Add them to **Preview** only if preview deployments should send messages; use a test inbox for previews. Add them to **Development** if using Vercel's local environment tooling. Otherwise local `npm run dev` reads `.env.local` directly.
6. Redeploy after changing Vercel environment settings. Submit one message, check `/admin/messages`, then check Resend's email logs for delivery and your inbox/spam folder. Confirm that Reply opens a response to the visitor.

Local commands (after configuring `.env.local`):

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

Open `http://localhost:3000/#contact`. Wait at least two seconds after loading, then submit a message of 10–5,000 characters. For development with hot reload, use `npm run dev` instead of build/start.

### Contact failure diagnostics

Check Vercel function logs for `[portfolio:contact-config]`, `[portfolio:contact-submit]`, or `[portfolio:contact-email]`. Logs contain missing variable **names**, operation stages, database error codes, or provider HTTP status; they do not contain credentials, message bodies, or raw provider responses.

- `503`: missing settings or invalid sender/recipient address format. Configure the variables in the deployment environment and redeploy.
- `400`/`413`/`415`: invalid fields/JSON, oversized body, or wrong content type.
- `429`: submission was too fast or the existing database rate limit was reached.
- `500`: Supabase configuration/query failed. Use the logged stage and database code to check the existing migration, project keys, and database availability.
- `502`: email delivery was not acknowledged. Check Resend's key, verified sender, limits, and logs. The message remains in `/admin/messages` so it is not lost. Failed email attempts still count toward the existing rate limit, and retries can create another admin copy. A stable provider idempotency key prevents duplicate email requests for an unchanged submission retried within Resend's 24-hour window. There is no background email retry worker.

The honeypot still quietly drops bot submissions. Autofill/fast submissions now receive a retry message instead of a false success; legitimate submissions after leaving the page open for over two hours are no longer silently discarded.

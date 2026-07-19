# daideeai-prompt

DaideeAI Prompt is a Lao- and English-language platform for creating programming prompts for ChatGPT, Codex, Cursor, and Claude Code.

## Default administrator bootstrap

Create `.env.local` from `.env.example` and set these runtime-only values:

```env
SUPABASE_SECRET_KEY=your_supabase_secret_key
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=a-long-unique-password
```

Apply `supabase/migrations/202607190003_default_admin_username.sql`. The first request after a deployment creates the admin when its username does not exist. When it exists, the account is updated in place (including password and admin role), so no duplicate user is created. Password hashing is handled by Supabase Auth and the password is never stored in `profiles`.

For Cloudflare Workers, configure `SUPABASE_SECRET_KEY` and `DEFAULT_ADMIN_PASSWORD` as **Secrets**, and `DEFAULT_ADMIN_USERNAME` as a variable or Secret in the Workers dashboard. Check `/api/health` for a clear bootstrap status; it never returns the password.

## Cloudflare Workers

The application uses the OpenNext adapter to deploy Next.js on Cloudflare Workers.

```bash
npm run preview                 # test with workerd/Wrangler
npm run deploy                  # build OpenNext and deploy production
npm run cf-versions-upload      # upload a preview version without promoting it
```

In Cloudflare Workers Builds, set:

- Build command: `npm run build:cloudflare`
- Deploy command: `npx wrangler deploy`
- Preview deploy command: `npx wrangler versions upload`

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Cloudflare Build Variables and secrets. Never commit `.env.local` or a Supabase secret.

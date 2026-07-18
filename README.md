# daideeai-prompt

## Default administrator bootstrap

Create `.env.local` from `.env.example` and set these runtime-only values:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=a-long-unique-password
```

Apply `supabase/migrations/202607190003_default_admin_username.sql`. The first request after a deployment creates the admin when its username does not exist. When it exists, the account is updated in place (including password and admin role), so no duplicate user is created. Password hashing is handled by Supabase Auth and the password is never stored in `profiles`.

For Cloudflare Workers, configure `SUPABASE_SERVICE_ROLE_KEY` and `DEFAULT_ADMIN_PASSWORD` as **Secrets**, and `DEFAULT_ADMIN_USERNAME` as a variable or Secret in the Workers dashboard. Check `/api/health` for a clear bootstrap status; it never returns the password.

DaideeAI Prompt — nền tảng tạo prompt lập trình đa ngôn ngữ cho ChatGPT, Codex, Cursor và Claude Code.

## Cloudflare Workers

Ứng dụng dùng OpenNext adapter để deploy Next.js lên Cloudflare Workers.

```bash
npm run preview                 # kiểm tra bằng workerd/Wrangler
npm run deploy                  # build OpenNext và deploy production
npm run cf-versions-upload     # upload preview version, chưa promote production
```

Trong Cloudflare Workers Builds, đặt:

- Build command: `npm run build:cloudflare`
- Deploy command: `npx wrangler deploy`
- Preview deploy command: `npx wrangler versions upload`

Khai báo `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` trong Build Variables and secrets của Cloudflare. Không commit `.env.local` hoặc secret Supabase.

# daideeai-prompt

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

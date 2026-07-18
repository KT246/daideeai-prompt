import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createClient } from "@supabase/supabase-js";

type BootstrapResult = { ok: boolean; status: "created" | "updated" | "skipped" | "error"; message: string };
type BootstrapConfig = { error: string } | { username: string; password: string; url: string; secretKey: string };
let bootstrapPromise: Promise<BootstrapResult> | undefined;

async function runtimeEnvironment(): Promise<Record<string, unknown>> {
  try {
    const context = await getCloudflareContext({ async: true });
    return { ...process.env, ...(context.env as unknown as Record<string, unknown>) };
  } catch {
    // `next build` and local Node.js execution do not have a Cloudflare request context.
    return process.env;
  }
}

const readEnvironmentValue = (environment: Record<string, unknown>, key: string) => {
  const value = environment[key];
  return typeof value === "string" ? value : undefined;
};

async function config(): Promise<BootstrapConfig> {
  const environment = await runtimeEnvironment();
  const username = readEnvironmentValue(environment, "DEFAULT_ADMIN_USERNAME")?.trim();
  const password = readEnvironmentValue(environment, "DEFAULT_ADMIN_PASSWORD");
  const url = readEnvironmentValue(environment, "NEXT_PUBLIC_SUPABASE_URL");
  const secretKey = readEnvironmentValue(environment, "SUPABASE_SECRET_KEY");
  if (!username || !password || !url || !secretKey) return { error: "Thiếu biến môi trường: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, DEFAULT_ADMIN_USERNAME hoặc DEFAULT_ADMIN_PASSWORD." };
  if (!/^[a-zA-Z0-9._-]{3,40}$/.test(username)) return { error: "DEFAULT_ADMIN_USERNAME chỉ được gồm chữ, số, dấu chấm, gạch dưới hoặc gạch nối (3-40 ký tự)." };
  if (password.length < 8) return { error: "DEFAULT_ADMIN_PASSWORD phải có ít nhất 8 ký tự." };
  return { username, password, url, secretKey };
}
const bootstrapEmail = (username: string) => `${username.toLowerCase()}@bootstrap.daideeai.local`;

async function bootstrap(): Promise<BootstrapResult> {
  const values = await config(); if ("error" in values) return { ok: false, status: "skipped", message: values.error };
  const { username, password, url, secretKey } = values;
  const admin = createClient(url, secretKey, { auth: { autoRefreshToken: false, persistSession: false } });
  async function syncAdmin(id: string): Promise<BootstrapResult> {
    const { error: passwordError } = await admin.auth.admin.updateUserById(id, { password, email_confirm: true, user_metadata: { full_name: username } });
    if (passwordError) return { ok: false, status: "error", message: `Không thể cập nhật mật khẩu tài khoản mặc định: ${passwordError.message}` };
    const { error: profileError } = await admin.from("profiles").upsert({ id, username, display_name: username, role: "admin" });
    return profileError ? { ok: false, status: "error", message: `Không thể cập nhật quyền admin: ${profileError.message}` } : { ok: true, status: "updated", message: `Tài khoản mặc định '${username}' đã tồn tại và được đồng bộ.` };
  }
  const { data: existing, error: lookupError } = await admin.from("profiles").select("id").ilike("username", username).maybeSingle();
  if (lookupError) return { ok: false, status: "error", message: `Không thể kiểm tra tài khoản mặc định: ${lookupError.message}` };
  if (existing) return syncAdmin(existing.id);
  const { data: created, error: createError } = await admin.auth.admin.createUser({ email: bootstrapEmail(username), password, email_confirm: true, user_metadata: { full_name: username } });
  if (createError || !created.user) {
    const { data: users } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const concurrentUser = users.users.find((user) => user.email === bootstrapEmail(username));
    if (concurrentUser) return syncAdmin(concurrentUser.id);
    return { ok: false, status: "error", message: `Không thể tạo tài khoản mặc định: ${createError?.message ?? "Supabase không trả về user."}` };
  }
  const { error: profileError } = await admin.from("profiles").upsert({ id: created.user.id, username, display_name: username, role: "admin" });
  return profileError ? { ok: false, status: "error", message: `Tạo Auth user thành công nhưng không thể tạo profile: ${profileError.message}` } : { ok: true, status: "created", message: `Đã tạo tài khoản admin mặc định '${username}'.` };
}

/** Safe to await from a server component. A worker isolate performs at most one bootstrap. */
export async function ensureDefaultAdmin(): Promise<BootstrapResult> {
  bootstrapPromise ??= bootstrap(); const result = await bootstrapPromise;
  if (!result.ok) console.error(`[default-admin-bootstrap] ${result.message}`); else console.info(`[default-admin-bootstrap] ${result.message}`);
  return result;
}

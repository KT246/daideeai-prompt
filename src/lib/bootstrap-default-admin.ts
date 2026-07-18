import "server-only";
import { createClient } from "@supabase/supabase-js";

type BootstrapResult = { ok: boolean; status: "created" | "updated" | "skipped" | "error"; message: string };
type BootstrapConfig = { error: string } | { username: string; password: string; url: string; serviceRoleKey: string };
let bootstrapPromise: Promise<BootstrapResult> | undefined;

function config(): BootstrapConfig {
  const username = process.env.DEFAULT_ADMIN_USERNAME?.trim(); const password = process.env.DEFAULT_ADMIN_PASSWORD; const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!username || !password || !url || !serviceRoleKey) return { error: "Thiếu biến môi trường: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEFAULT_ADMIN_USERNAME hoặc DEFAULT_ADMIN_PASSWORD." };
  if (!/^[a-zA-Z0-9._-]{3,40}$/.test(username)) return { error: "DEFAULT_ADMIN_USERNAME chỉ được gồm chữ, số, dấu chấm, gạch dưới hoặc gạch nối (3-40 ký tự)." };
  if (password.length < 8) return { error: "DEFAULT_ADMIN_PASSWORD phải có ít nhất 8 ký tự." };
  return { username, password, url, serviceRoleKey };
}
const bootstrapEmail = (username: string) => `${username.toLowerCase()}@bootstrap.daideeai.local`;

async function bootstrap(): Promise<BootstrapResult> {
  const values = config(); if ("error" in values) return { ok: false, status: "skipped", message: values.error };
  const { username, password, url, serviceRoleKey } = values;
  const admin = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
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

import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const payloadSchema = z.object({ generator: z.enum(["crud", "builder", "debugging", "system-checking", "function", "debug", "system-check"]), content: z.string().min(50).max(30000), title: z.string().max(140).optional(), inputData: z.record(z.string(), z.string()).optional() });
export async function POST(request: Request) {
  const parsed = payloadSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  const supabase = await createClient(); if (!supabase) return NextResponse.json({ error: "Supabase chưa được cấu hình." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser(); if (!user) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  const { error } = await supabase.from("generated_prompts").insert({ user_id: user.id, generator: parsed.data.generator, content: parsed.data.content, title: parsed.data.title ?? null, input_data: parsed.data.inputData ?? {} });
  if (error) return NextResponse.json({ error: "Không thể lưu lịch sử." }, { status: 400 });
  return NextResponse.json({ ok: true }, { status: 201 });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({ status: z.enum(["draft", "published", "archived"]) });
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 }); const supabase = await createClient(); if (!supabase) return NextResponse.json({ error: "Supabase chưa được cấu hình." }, { status: 503 }); const { data: allowed } = await supabase.rpc("is_admin"); if (!allowed) return NextResponse.json({ error: "Không có quyền quản trị." }, { status: 403 }); const { error } = await supabase.from("prompts").update({ status: parsed.data.status }).eq("id", (await params).id); if (error) return NextResponse.json({ error: "Không thể cập nhật prompt." }, { status: 400 }); return NextResponse.json({ ok: true }); }

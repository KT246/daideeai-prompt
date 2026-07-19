import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const { error } = await supabase.rpc("increment_prompt_copy", { prompt_id: (await params).id });
  if (error) return NextResponse.json({ error: "Could not record the copy." }, { status: 400 });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const promptId = (await params).id;
  const { data: existing } = await supabase.from("favorites").select("id").eq("user_id", user.id).eq("prompt_id", promptId).maybeSingle();
  if (existing) { const { error } = await supabase.from("favorites").delete().eq("id", existing.id); if (error) return NextResponse.json({ error: "Could not remove favorite." }, { status: 400 }); return NextResponse.json({ favorited: false }); }
  const { error } = await supabase.from("favorites").insert({ user_id: user.id, prompt_id: promptId });
  if (error) return NextResponse.json({ error: "Could not save favorite." }, { status: 400 });
  return NextResponse.json({ favorited: true });
}

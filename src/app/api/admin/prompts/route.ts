import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const promptSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase letters, numbers, and hyphens."),
  title: z.string().min(3).max(160),
  description: z.string().min(10).max(500),
  category: z.string().min(2).max(100),
  technologies: z.array(z.string().min(1).max(80)).max(20),
  useCase: z.string().min(3).max(4000),
  instructions: z.string().min(3).max(8000),
  content: z.string().min(10).max(30000),
  access: z.enum(["free", "pro"]),
  status: z.enum(["draft", "published", "archived"]),
});

async function getAdmin() {
  const supabase = await createClient();
  if (!supabase) return { error: NextResponse.json({ error: "Supabase is not configured." }, { status: 503 }) };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Administrator sign-in is required." }, { status: 401 }) };
  const { data: allowed } = await supabase.rpc("is_admin");
  if (!allowed) return { error: NextResponse.json({ error: "Administrator access is required." }, { status: 403 }) };
  return { supabase, user };
}

export async function POST(request: Request) {
  const parsed = promptSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid prompt data." }, { status: 400 });
  const access = await getAdmin();
  if ("error" in access) return access.error;
  const { data, error } = await access.supabase.from("prompts").insert({
    slug: parsed.data.slug,
    title: parsed.data.title,
    description: parsed.data.description,
    category: parsed.data.category,
    technologies: parsed.data.technologies,
    use_case: parsed.data.useCase,
    instructions: parsed.data.instructions,
    content: parsed.data.content,
    access: parsed.data.access,
    status: parsed.data.status,
    created_by: access.user.id,
  }).select("id,slug,title,description,category,technologies,use_case,instructions,content,access,status,copy_count,created_at").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ prompt: data }, { status: 201 });
}

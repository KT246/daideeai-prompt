import { NextResponse } from "next/server";
import { ensureDefaultAdmin } from "@/lib/bootstrap-default-admin";
export async function GET() { const bootstrap = await ensureDefaultAdmin(); return NextResponse.json({ status: bootstrap.ok ? "ok" : "degraded", defaultAdminBootstrap: bootstrap.status, message: bootstrap.message }, { status: bootstrap.ok ? 200 : 503 }); }

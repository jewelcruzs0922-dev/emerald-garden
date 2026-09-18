import { NextResponse } from "next/server";
import { availableMap } from "@/lib/commerce/inventory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Live availability, so sold-out badges reflect actual stock. */
export async function GET() {
  try {
    return NextResponse.json(
      { ok: true, availability: await availableMap() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[emerald-garden] inventory read failed:", error);
    return NextResponse.json({ ok: false, availability: {} }, { status: 500 });
  }
}

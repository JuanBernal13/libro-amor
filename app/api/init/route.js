import { ensureDefaultBook } from "@/app/lib/db";
import { NextResponse } from "next/server";

// GET /api/init - ensure the default book exists
export async function GET() {
    try {
        await ensureDefaultBook();
        return NextResponse.json({ success: true, message: "Database initialized" });
    } catch (error) {
        console.error("GET /api/init error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

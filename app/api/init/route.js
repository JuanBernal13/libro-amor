import { getSQL, initDB } from "@/app/lib/db";
import { NextResponse } from "next/server";

// GET /api/init — initialize the database tables
export async function GET() {
    try {
        await initDB();
        return NextResponse.json({ success: true, message: "Database initialized" });
    } catch (error) {
        console.error("GET /api/init error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

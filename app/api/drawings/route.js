import { getSQL, initDB } from "@/app/lib/db";
import { validateEditKey, unauthorizedResponse } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await initDB();
        const sql = getSQL();
        const drawings = await sql`SELECT * FROM drawings ORDER BY created_at ASC, id ASC`;
        return NextResponse.json(drawings);
    } catch (error) {
        console.error("GET /api/drawings error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    if (!validateEditKey(request)) return unauthorizedResponse();
    try {
        const sql = getSQL();
        const { url, title, description } = await request.json();
        
        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        const [newDrawing] = await sql`
            INSERT INTO drawings (url, title, description)
            VALUES (${url}, ${title || ''}, ${description || ''})
            RETURNING *
        `;

        return NextResponse.json(newDrawing);
    } catch (error) {
        console.error("POST /api/drawings error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    if (!validateEditKey(request)) return unauthorizedResponse();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const sql = getSQL();
        await sql`DELETE FROM drawings WHERE id = ${id}`;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/drawings error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

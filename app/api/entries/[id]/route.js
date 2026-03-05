import { getSQL } from "@/app/lib/db";
import { NextResponse } from "next/server";

// PUT /api/entries/[id] — update an entry
export async function PUT(request, { params }) {
    try {
        const sql = getSQL();
        const { id } = await params;
        const data = await request.json();

        const { caption, description, title, body, date_text, photo_url } = data;

        await sql`
      UPDATE entries SET
        caption = COALESCE(${caption ?? null}, caption),
        description = COALESCE(${description ?? null}, description),
        title = COALESCE(${title ?? null}, title),
        body = COALESCE(${body ?? null}, body),
        date_text = COALESCE(${date_text ?? null}, date_text),
        photo_url = COALESCE(${photo_url ?? null}, photo_url),
        updated_at = NOW()
      WHERE id = ${id}
    `;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PUT /api/entries/[id] error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/entries/[id] — delete an entry
export async function DELETE(request, { params }) {
    try {
        const sql = getSQL();
        const { id } = await params;

        await sql`DELETE FROM entries WHERE id = ${id}`;

        // Re-order remaining entries
        const remaining = await sql`
      SELECT id FROM entries WHERE book_id = 1 ORDER BY chapter_order ASC
    `;
        for (let i = 0; i < remaining.length; i++) {
            await sql`UPDATE entries SET chapter_order = ${i + 1} WHERE id = ${remaining[i].id}`;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/entries/[id] error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

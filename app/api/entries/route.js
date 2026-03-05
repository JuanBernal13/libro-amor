import { getSQL } from "@/app/lib/db";
import { NextResponse } from "next/server";

// POST /api/entries — create new entry
export async function POST(request) {
    try {
        const sql = getSQL();
        const { book_id = 1 } = await request.json();

        // Get next chapter order
        const result = await sql`
      SELECT COALESCE(MAX(chapter_order), 0) + 1 as next_order 
      FROM entries WHERE book_id = ${book_id}
    `;
        const nextOrder = result[0].next_order;

        const rows = await sql`
      INSERT INTO entries (book_id, chapter_order, photo_url, caption, title, body, date_text)
      VALUES (${book_id}, ${nextOrder}, '', '', '', '', '')
      RETURNING *
    `;

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error("POST /api/entries error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

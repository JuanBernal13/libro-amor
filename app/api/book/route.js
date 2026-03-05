import { getSQL, initDB } from "@/app/lib/db";
import { validateEditKey, unauthorizedResponse } from "@/app/lib/auth";
import { NextResponse } from "next/server";

// GET /api/book — get book + entries
export async function GET() {
    try {
        await initDB();
        const sql = getSQL();

        const books = await sql`SELECT * FROM book LIMIT 1`;
        const book = books[0] || { id: 1, title: "Nuestros Recuerdos", subtitle: "Un viaje a través del tiempo", dedication: "" };

        const entries = await sql`
      SELECT * FROM entries 
      WHERE book_id = ${book.id} 
      ORDER BY chapter_order ASC
    `;

        return NextResponse.json({ book, entries });
    } catch (error) {
        console.error("GET /api/book error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT /api/book — update book metadata (title, subtitle, dedication)
export async function PUT(request) {
    if (!validateEditKey(request)) return unauthorizedResponse();
    try {
        const sql = getSQL();
        const { title, subtitle, dedication } = await request.json();

        await sql`
      UPDATE book SET 
        title = COALESCE(${title}, title),
        subtitle = COALESCE(${subtitle}, subtitle),
        dedication = COALESCE(${dedication}, dedication),
        updated_at = NOW()
      WHERE id = 1
    `;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PUT /api/book error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

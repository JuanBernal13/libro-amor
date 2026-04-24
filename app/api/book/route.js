import { ensureDefaultBook, pickDefined, prisma, toApiBook, toApiEntry } from "@/app/lib/db";
import { validateEditKey, unauthorizedResponse } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const book = await ensureDefaultBook();
        const entries = await prisma.entry.findMany({
            where: { bookId: book.id },
            orderBy: { chapterOrder: "asc" },
        });

        return NextResponse.json({ book: toApiBook(book), entries: entries.map(toApiEntry) });
    } catch (error) {
        console.error("GET /api/book error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    if (!validateEditKey(request)) return unauthorizedResponse();
    try {
        const book = await ensureDefaultBook();
        const data = pickDefined(await request.json(), [
            ["title", "title"],
            ["subtitle", "subtitle"],
            ["dedication", "dedication"],
        ]);

        if (Object.keys(data).length) {
            await prisma.book.update({ where: { id: book.id }, data });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PUT /api/book error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

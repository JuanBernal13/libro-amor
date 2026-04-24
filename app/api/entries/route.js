import { prisma, toApiEntry } from "@/app/lib/db";
import { validateEditKey, unauthorizedResponse } from "@/app/lib/auth";
import { NextResponse } from "next/server";

// POST /api/entries - create new entry
export async function POST(request) {
    if (!validateEditKey(request)) return unauthorizedResponse();
    try {
        const { book_id = 1 } = await request.json();
        const bookId = Number(book_id);

        const lastEntry = await prisma.entry.findFirst({
            where: { bookId },
            orderBy: { chapterOrder: "desc" },
            select: { chapterOrder: true },
        });

        const entry = await prisma.entry.create({
            data: {
                bookId,
                chapterOrder: (lastEntry?.chapterOrder || 0) + 1,
            },
        });

        return NextResponse.json(toApiEntry(entry));
    } catch (error) {
        console.error("POST /api/entries error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

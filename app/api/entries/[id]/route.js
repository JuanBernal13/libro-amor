import { pickDefined, prisma } from "@/app/lib/db";
import { validateEditKey, unauthorizedResponse } from "@/app/lib/auth";
import { NextResponse } from "next/server";

// PUT /api/entries/[id] - update an entry
export async function PUT(request, { params }) {
    if (!validateEditKey(request)) return unauthorizedResponse();
    try {
        const { id } = await params;
        const entryId = Number(id);
        const data = pickDefined(await request.json(), [
            ["caption", "caption"],
            ["description", "description"],
            ["title", "title"],
            ["body", "body"],
            ["date_text", "dateText"],
            ["photo_url", "photoUrl"],
            ["video_url", "videoUrl"],
        ]);

        if (Object.keys(data).length) {
            await prisma.entry.update({ where: { id: entryId }, data });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PUT /api/entries/[id] error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/entries/[id] - delete an entry
export async function DELETE(request, { params }) {
    if (!validateEditKey(request)) return unauthorizedResponse();
    try {
        const { id } = await params;
        const entryId = Number(id);

        await prisma.$transaction(async (tx) => {
            const deleted = await tx.entry.delete({
                where: { id: entryId },
                select: { bookId: true },
            });

            const remaining = await tx.entry.findMany({
                where: { bookId: deleted.bookId },
                orderBy: { chapterOrder: "asc" },
                select: { id: true },
            });

            await Promise.all(
                remaining.map((entry, index) =>
                    tx.entry.update({
                        where: { id: entry.id },
                        data: { chapterOrder: index + 1 },
                    })
                )
            );
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/entries/[id] error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

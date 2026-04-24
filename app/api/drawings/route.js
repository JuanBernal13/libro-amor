import { prisma, toApiDrawing } from "@/app/lib/db";
import { validateEditKey, unauthorizedResponse } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const drawings = await prisma.drawing.findMany({
            orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        });
        return NextResponse.json(drawings.map(toApiDrawing));
    } catch (error) {
        console.error("GET /api/drawings error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    if (!validateEditKey(request)) return unauthorizedResponse();
    try {
        const { url, title, description } = await request.json();

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        const newDrawing = await prisma.drawing.create({
            data: {
                url,
                title: title || "",
                description: description || "",
            },
        });

        return NextResponse.json(toApiDrawing(newDrawing));
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

        await prisma.drawing.delete({ where: { id: Number(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/drawings error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

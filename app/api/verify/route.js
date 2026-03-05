import { NextResponse } from "next/server";

// POST /api/verify — check if edit key is valid
export async function POST(request) {
    try {
        const { key } = await request.json();
        const valid = key === process.env.EDIT_KEY;
        return NextResponse.json({ valid });
    } catch {
        return NextResponse.json({ valid: false });
    }
}

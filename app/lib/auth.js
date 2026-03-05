import { NextResponse } from "next/server";

export function validateEditKey(request) {
    const key = request.headers.get("x-edit-key");
    return key === process.env.EDIT_KEY;
}

export function unauthorizedResponse() {
    return NextResponse.json(
        { error: "No autorizado. Modo solo lectura." },
        { status: 403 }
    );
}

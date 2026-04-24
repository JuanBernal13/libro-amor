import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export function toApiBook(book) {
    return {
        id: book.id,
        title: book.title,
        subtitle: book.subtitle,
        dedication: book.dedication,
        created_at: book.createdAt,
        updated_at: book.updatedAt,
    };
}

export function toApiEntry(entry) {
    return {
        id: entry.id,
        book_id: entry.bookId,
        chapter_order: entry.chapterOrder,
        photo_url: entry.photoUrl,
        video_url: entry.videoUrl,
        caption: entry.caption,
        description: entry.description,
        title: entry.title,
        body: entry.body,
        date_text: entry.dateText,
        created_at: entry.createdAt,
        updated_at: entry.updatedAt,
    };
}

export function toApiDrawing(drawing) {
    return {
        id: drawing.id,
        url: drawing.url,
        title: drawing.title,
        description: drawing.description,
        created_at: drawing.createdAt,
    };
}

export function pickDefined(source, fields) {
    return Object.fromEntries(
        fields
            .filter(([apiField]) => source[apiField] !== undefined && source[apiField] !== null)
            .map(([apiField, prismaField]) => [prismaField, source[apiField]])
    );
}

export async function ensureDefaultBook() {
    const book = await prisma.book.findFirst({ orderBy: { id: "asc" } });
    if (book) return book;

    return prisma.book.create({
        data: {
            title: "Nuestros Recuerdos",
            subtitle: "Un viaje a través del tiempo",
            dedication: "",
        },
    });
}

import { neon } from "@neondatabase/serverless";

export function getSQL() {
  return neon(process.env.DATABASE_URL);
}

export async function initDB() {
  const sql = getSQL();

  await sql`
    CREATE TABLE IF NOT EXISTS book (
      id SERIAL PRIMARY KEY,
      title TEXT DEFAULT 'Nuestros Recuerdos',
      subtitle TEXT DEFAULT 'Un viaje a través del tiempo',
      dedication TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS entries (
      id SERIAL PRIMARY KEY,
      book_id INTEGER DEFAULT 1,
      chapter_order INTEGER NOT NULL,
      photo_url TEXT DEFAULT '',
      caption TEXT DEFAULT '',
      title TEXT DEFAULT '',
      body TEXT DEFAULT '',
      date_text TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Ensure there's at least one book
  const books = await sql`SELECT id FROM book LIMIT 1`;
  if (books.length === 0) {
    await sql`INSERT INTO book (title, subtitle, dedication) VALUES ('Nuestros Recuerdos', 'Un viaje a través del tiempo', '')`;
  }

  return sql;
}

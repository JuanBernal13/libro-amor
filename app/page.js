"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "./hub.css";

function HubInner() {
  const searchParams = useSearchParams();
  const editKey = searchParams.get("edit");
  const editQuery = editKey ? `?edit=${editKey}` : "";

  return (
    <main className="hub-container">
      <div className="particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`particle ${i % 2 === 0 ? 'petal' : 'star'}`}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`
            }}
          />
        ))}
      </div>

      <header className="hub-header">
        <h1 className="hub-title">Nuestro Mundo</h1>
        <p className="hub-subtitle">Colección de recuerdos para mi amorcito</p>
      </header>

      <section className="hub-grid">
        <Link href={`/dibujos${editQuery}`} className="hub-card">
          <h2 className="hub-card-title">Dibujos</h2>
          <p className="hub-card-desc">Nuestros trazos y creaciones juntos.</p>
        </Link>

        <Link href={`/dia-mujer${editQuery}`} className="hub-card">
          <h2 className="hub-card-title">Día de la Mujer</h2>
          <p className="hub-card-desc">Día especial para mi amorcito.</p>
        </Link>

        <Link href={`/libro${editQuery}`} className="hub-card">
          <h2 className="hub-card-title">Nuestro Libro</h2>
          <p className="hub-card-desc">Un viaje por nuestra historia, fotos y mensajes especiales.</p>
        </Link>
      </section>

      <footer style={{ marginTop: "4rem", opacity: 0.4, color: "var(--gold-light)", fontFamily: "Playfair Display, serif", letterSpacing: "2px" }}>
        Hecho con mucho amorcito amor
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HubInner />
    </Suspense>
  );
}

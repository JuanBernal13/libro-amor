"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "./hub.css";

function seededValue(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: seededValue(i + 1) * 100,
  delay: seededValue(i + 21) * 8,
  duration: 6 + seededValue(i + 41) * 6,
}));

function HubInner() {
  const searchParams = useSearchParams();
  const editKey = searchParams.get("edit");
  const editQuery = editKey ? `?edit=${editKey}` : "";

  return (
    <main className="hub-container">
      <div className="particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`particle ${particle.id % 2 === 0 ? 'petal' : 'star'}`}
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      <header className="hub-header">
        <h1 className="hub-title">Nuestro Mundo</h1>
        <p className="hub-subtitle">Colección de recuerdos para mi amorcito</p>
      </header>

      <section className="hub-grid">
        <Link href="/cartica-lindi" className="hub-card">
          <h2 className="hub-card-title">Cartica para mi amorcito</h2>
          <p className="hub-card-desc">Mensajito especial para mi amorcito.</p>
        </Link>

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

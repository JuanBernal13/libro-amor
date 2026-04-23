"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const FALLBACK_MESSAGE = {
  title: "Cartica Lindi",
  body: [
    "Amor, quiero expresarte mediante este mensaje que tú eres lo más bonito de mi mundo.",
    "Sé que no estás pasando por un buen momento emocionalmente, y quiero que sepas que no tienes que aparentar que todo está bien.",
    "Puedes sentir todo lo que necesites sentir. Aquí estamos los dos, siempre para salir adelante, los dos juntitos.",
    "Entiendo todo lo que estás lidiando emocionalmente y todo lo que esto te puede estar afectando en este momento.",
    "No estás solita, amor, aquí estoy, siempre voy a estar contigo. Somos dos en esto.",
    "Siempre estaremos cogidos de la mano, siempre. Cuando no te sientas muy bien, vamos a estar los dos siempre.",
    "Créeme que sí, te adoro con todo mi ser, amor. Eres quien da sentido a mi vida.",
  ],
  image: "/imagen_mensaje.png",
};

export default function CarticaLindiPage() {
  const [message, setMessage] = useState(FALLBACK_MESSAGE);
  const [imageStatus, setImageStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/cartica-lindi")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data?.title && data?.body) {
          setMessage({
            title: data.title,
            body: Array.isArray(data.body) ? data.body : FALLBACK_MESSAGE.body,
            image: data.image || FALLBACK_MESSAGE.image,
          });
        }
      })
      .catch(() => {
        // Keep fallback content if the endpoint is unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="cartica-shell">
      <div className="cartica-glow cartica-glow-left" />
      <div className="cartica-glow cartica-glow-right" />

      <Link href="/" className="back-btn-global">
        ← Inicio
      </Link>

      <article className="cartica-card">
        <header className="cartica-header">
          <p className="cartica-kicker">Para mi amorcito</p>
          <h1>{message.title}</h1>
          <div className="cartica-divider" />
        </header>

        <section className="cartica-layout">
          <div className="cartica-image-frame">
            <img
              src={message.image}
              alt="Imagen del mensaje"
              onLoad={() => setImageStatus("loaded")}
              onError={() => setImageStatus("error")}
            />
            {imageStatus !== "loaded" && (
              <div className="cartica-image-placeholder">
                <span>
                  {imageStatus === "error"
                    ? "Falta imagen_mensaje.png"
                    : "Espacio para imagen_mensaje.png"}
                </span>
              </div>
            )}
          </div>

          <div className="cartica-text">
            {message.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>

        <footer className="cartica-footer">
          <span>Con todo mi amor</span>
        </footer>
      </article>
    </main>
  );
}

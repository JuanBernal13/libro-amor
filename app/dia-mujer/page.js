"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./dia-mujer.css";

function seededValue(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

const hearts = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: seededValue(i + 1) * 100,
    delay: seededValue(i + 31) * 8,
    duration: 6 + seededValue(i + 61) * 8,
    size: 10 + seededValue(i + 91) * 22,
    opacity: 0.15 + seededValue(i + 121) * 0.4,
}));

const sparkles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: seededValue(i + 151) * 100,
    top: seededValue(i + 191) * 100,
    delay: seededValue(i + 231) * 5,
    duration: 2 + seededValue(i + 271) * 3,
    size: 2 + seededValue(i + 311) * 4,
}));

const petals = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: seededValue(i + 351) * 100,
    delay: seededValue(i + 381) * 10,
    duration: 8 + seededValue(i + 411) * 7,
    size: 8 + seededValue(i + 441) * 14,
    rotation: seededValue(i + 471) * 360,
}));

export default function DiaMujer() {
    const [showContent, setShowContent] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [showExtra, setShowExtra] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        // Stagger reveal animations
        setTimeout(() => setShowContent(true), 600);
        setTimeout(() => setShowMessage(true), 1800);
        setTimeout(() => setShowExtra(true), 3200);
    }, []);

    return (
        <div className="dm-container" ref={containerRef}>
            {/* Background animated gradient */}
            <div className="dm-bg-gradient" />

            {/* Back button */}
            <Link href="/" className="dm-back-btn">
                ← Volver
            </Link>

            {/* Floating hearts */}
            <div className="dm-hearts-layer">
                {hearts.map((h) => (
                    <div
                        key={h.id}
                        className="dm-floating-heart"
                        style={{
                            left: `${h.left}%`,
                            animationDelay: `${h.delay}s`,
                            animationDuration: `${h.duration}s`,
                            fontSize: `${h.size}px`,
                            opacity: h.opacity,
                        }}
                    >
                        ♥
                    </div>
                ))}
            </div>

            {/* Sparkle particles */}
            <div className="dm-sparkles-layer">
                {sparkles.map((s) => (
                    <div
                        key={s.id}
                        className="dm-sparkle"
                        style={{
                            left: `${s.left}%`,
                            top: `${s.top}%`,
                            animationDelay: `${s.delay}s`,
                            animationDuration: `${s.duration}s`,
                            width: `${s.size}px`,
                            height: `${s.size}px`,
                        }}
                    />
                ))}
            </div>

            {/* Falling petals */}
            <div className="dm-petals-layer">
                {petals.map((p) => (
                    <div
                        key={p.id}
                        className="dm-petal"
                        style={{
                            left: `${p.left}%`,
                            animationDelay: `${p.delay}s`,
                            animationDuration: `${p.duration}s`,
                            width: `${p.size}px`,
                            height: `${p.size * 1.4}px`,
                            transform: `rotate(${p.rotation}deg)`,
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className={`dm-content ${showContent ? "dm-visible" : ""}`}>
                {/* Top ornament */}
                <div className="dm-ornament-top">✦ ✦ ✦</div>

                {/* Date badge */}
                <div className="dm-date-badge">
                    <span>Para mi amorcito</span>
                </div>

                {/* Flower image */}
                <div className="dm-flower-frame">
                    <img src="/flowers.png" alt="Flores para ti" />
                    <div className="dm-flower-glow" />
                </div>

                {/* Title */}
                <h1 className="dm-title">
                    <span className="dm-title-line1">Feliz Día</span>
                    <span className="dm-title-line2">de la Mujer</span>
                </h1>

                {/* Decorative divider */}
                <div className="dm-divider">
                    <span className="dm-divider-line" />
                    <span className="dm-divider-heart">♥</span>
                    <span className="dm-divider-line" />
                </div>

                {/* Love message */}
                <div className={`dm-message ${showMessage ? "dm-visible" : ""}`}>
                    <div className="dm-quote-mark">&ldquo;</div>
                    <p className="dm-message-text">
                        Feliz día de la mujer mi amor.
                        <br />
                        <span className="dm-highlight">Te amo mucho mucho mucho</span>
                    </p>
                    <div className="dm-quote-mark dm-quote-end">&rdquo;</div>
                </div>

                {/* Extra love section */}
                <div className={`dm-extra ${showExtra ? "dm-visible" : ""}`}>
                    <p className="dm-extra-text">
                        Eres el amorcito de mi vida amor.
                        <br />
                        Te amo mucho mucho mucho mucho mucho
                    </p>
                    <div className="dm-signature">
                        <span className="dm-forever">Siempre a tu lado mi vida</span>
                    </div>
                </div>

                {/* Bottom ornament */}
                <div className="dm-ornament-bottom">✦ ✦ ✦</div>
            </div>
        </div>
    );
}

"use client";
import { useEffect, useRef, useState } from "react";
import "./dia-mujer.css";

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

    // Generate floating hearts
    const hearts = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 8,
        size: 10 + Math.random() * 22,
        opacity: 0.15 + Math.random() * 0.4,
    }));

    // Generate sparkle particles
    const sparkles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 3,
        size: 2 + Math.random() * 4,
    }));

    // Generate petals
    const petals = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 8 + Math.random() * 7,
        size: 8 + Math.random() * 14,
        rotation: Math.random() * 360,
    }));

    return (
        <div className="dm-container" ref={containerRef}>
            {/* Background animated gradient */}
            <div className="dm-bg-gradient" />

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
                    <div className="dm-quote-mark">"</div>
                    <p className="dm-message-text">
                        Feliz día de la mujer mi amor.
                        <br />
                        <span className="dm-highlight">Te amo mucho mucho mucho</span>
                    </p>
                    <div className="dm-quote-mark dm-quote-end">"</div>
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

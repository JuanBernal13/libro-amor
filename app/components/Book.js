"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
    "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];

function BookInner() {
    const searchParams = useSearchParams();
    const [book, setBook] = useState(null);
    const [entries, setEntries] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lightboxSrc, setLightboxSrc] = useState(null);
    const [uploading, setUploading] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editKey, setEditKey] = useState("");

    const saveTimerRef = useRef(null);
    const fileInputRefs = useRef({});

    // ── Check edit mode ──
    useEffect(() => {
        const key = searchParams.get("edit");
        if (key) {
            setEditKey(key);
            // Verify the key with the server
            fetch("/api/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key }),
            })
                .then(r => r.json())
                .then(data => setEditMode(data.valid))
                .catch(() => setEditMode(false));
        }
    }, [searchParams]);

    // ── Helper: auth headers ──
    function authHeaders() {
        return {
            "Content-Type": "application/json",
            "x-edit-key": editKey,
        };
    }

    // ── Load data ──
    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const res = await fetch("/api/book");
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setBook(data.book);
            setEntries(data.entries || []);
        } catch (err) {
            console.error("Error loading:", err);
            try {
                await fetch("/api/init");
                const res = await fetch("/api/book");
                const data = await res.json();
                setBook(data.book);
                setEntries(data.entries || []);
            } catch (e) {
                console.error("Init error:", e);
                setBook({ id: 1, title: "Nuestros Recuerdos", subtitle: "Un viaje a través del tiempo", dedication: "" });
                setEntries([]);
            }
        } finally {
            setLoading(false);
        }
    }

    // ── Auto-save book metadata ──
    const saveBook = useCallback((updatedBook) => {
        if (!editMode) return;
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(async () => {
            setSaving(true);
            try {
                await fetch("/api/book", {
                    method: "PUT",
                    headers: authHeaders(),
                    body: JSON.stringify(updatedBook),
                });
            } catch (e) { console.error(e); }
            setTimeout(() => setSaving(false), 800);
        }, 1000);
    }, [editMode, editKey]);

    // ── Auto-save entry ──
    const saveEntry = useCallback((id, field, value) => {
        if (!editMode) return;
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(async () => {
            setSaving(true);
            try {
                await fetch(`/api/entries/${id}`, {
                    method: "PUT",
                    headers: authHeaders(),
                    body: JSON.stringify({ [field]: value }),
                });
            } catch (e) { console.error(e); }
            setTimeout(() => setSaving(false), 800);
        }, 1000);
    }, [editMode, editKey]);

    // ── Update book field ──
    function handleBookChange(field, value) {
        if (!editMode) return;
        const updated = { ...book, [field]: value };
        setBook(updated);
        saveBook(updated);
    }

    // ── Update entry field ──
    function handleEntryChange(id, field, value) {
        if (!editMode) return;
        setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
        saveEntry(id, field, value);
    }

    // ── Upload image ──
    async function handleImageUpload(entryId, file) {
        if (!file || !editMode) return;
        setUploading(entryId);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", {
                method: "POST",
                headers: { "x-edit-key": editKey },
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                setEntries(prev => prev.map(e => e.id === entryId ? { ...e, photo_url: data.url } : e));
                await fetch(`/api/entries/${entryId}`, {
                    method: "PUT",
                    headers: authHeaders(),
                    body: JSON.stringify({ photo_url: data.url }),
                });
            }
        } catch (e) {
            console.error("Upload error:", e);
        }
        setUploading(null);
    }

    // ── Add new entry ──
    async function addEntry() {
        if (!editMode) return;
        setSaving(true);
        try {
            const res = await fetch("/api/entries", {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({ book_id: book?.id || 1 }),
            });
            const newEntry = await res.json();
            setEntries(prev => [...prev, newEntry]);
            setCurrentPage(entries.length + 1);
        } catch (e) {
            console.error("Add error:", e);
        }
        setSaving(false);
    }

    // ── Navigation ──
    const totalLeaves = entries.length + 2;

    function nextPage() {
        if (currentPage < totalLeaves) setCurrentPage(p => p + 1);
    }
    function prevPage() {
        if (currentPage > 0) setCurrentPage(p => p - 1);
    }
    function goToPage(idx) {
        setCurrentPage(idx);
    }

    // ── Keyboard nav ──
    useEffect(() => {
        function onKey(e) {
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) return;
            if (e.key === "ArrowRight") nextPage();
            if (e.key === "ArrowLeft") prevPage();
            if (e.key === "Escape" && lightboxSrc) setLightboxSrc(null);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    // ── Particles ──
    useEffect(() => {
        const c = document.getElementById("particles");
        if (!c || c.children.length > 0) return;
        const types = ["petal", "star", "star", "petal"];
        for (let i = 0; i < 25; i++) {
            const p = document.createElement("div");
            p.classList.add("particle", types[i % 4]);
            p.style.left = Math.random() * 100 + "%";
            p.style.animationDuration = (7 + Math.random() * 8) + "s";
            p.style.animationDelay = (Math.random() * 12) + "s";
            c.appendChild(p);
        }
    }, []);

    // ══════════════════════════════════════
    //  BUILD LEAVES — edit vs read-only
    // ══════════════════════════════════════
    function buildLeaves() {
        const leaves = [];

        // LEAF 0: Cover / Dedication
        leaves.push({
            front: (
                <div className="pg-content pg-cover">
                    <div className="orn">✦ ✧ ✦</div>
                    {editMode ? (
                        <h2
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={e => handleBookChange("title", e.target.textContent)}
                            onClick={e => e.stopPropagation()}
                        >{book?.title || "Nuestros Recuerdos"}</h2>
                    ) : (
                        <h2>{book?.title || "Nuestros Recuerdos"}</h2>
                    )}
                    <div className="line"></div>
                    {editMode ? (
                        <p
                            className="date-text"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={e => handleBookChange("subtitle", e.target.textContent)}
                            onClick={e => e.stopPropagation()}
                        >{book?.subtitle || "Un viaje a través del tiempo"}</p>
                    ) : (
                        <p className="date-text">{book?.subtitle || "Un viaje a través del tiempo"}</p>
                    )}
                    <div className="orn" style={{ marginTop: "16px" }}>✦ ✧ ✦</div>
                </div>
            ),
            back: (
                <div className="pg-content pg-dedication">
                    <div className="quote-mark">&ldquo;</div>
                    {editMode ? (
                        <textarea
                            defaultValue={book?.dedication || ""}
                            placeholder="Escribe aquí una dedicatoria especial..."
                            rows={4}
                            onClick={e => e.stopPropagation()}
                            onBlur={e => handleBookChange("dedication", e.target.value)}
                        />
                    ) : (
                        <p className="readonly-dedication">{book?.dedication || ""}</p>
                    )}
                    <div className="ded-line"></div>
                </div>
            )
        });

        // ENTRY LEAVES
        entries.forEach((entry, i) => {
            leaves.push({
                front: (
                    <div className="pg-content pg-entry">
                        <div className="entry-header">Capítulo {ROMAN[i] || i + 1}</div>
                        <div className="photo-zone">
                            <div className="photo-wrapper">
                                {uploading === entry.id ? (
                                    <div className="photo-placeholder">
                                        <span className="ph-icon">⏳</span>
                                        <span className="ph-label">Subiendo...</span>
                                    </div>
                                ) : entry.photo_url ? (
                                    <img
                                        src={entry.photo_url}
                                        alt="Foto"
                                        onClick={e => { e.stopPropagation(); setLightboxSrc(entry.photo_url); }}
                                        onDoubleClick={e => {
                                            if (!editMode) return;
                                            e.stopPropagation();
                                            fileInputRefs.current[entry.id]?.click();
                                        }}
                                    />
                                ) : editMode ? (
                                    <div
                                        className="photo-placeholder"
                                        onClick={e => {
                                            e.stopPropagation();
                                            fileInputRefs.current[entry.id]?.click();
                                        }}
                                    >
                                        <span className="ph-icon">📷</span>
                                        <span className="ph-label">Añadir foto</span>
                                    </div>
                                ) : (
                                    <div className="photo-placeholder">
                                        <span className="ph-icon">🌸</span>
                                        <span className="ph-label">Sin foto</span>
                                    </div>
                                )}
                                {editMode && (
                                    <input
                                        type="file"
                                        className="hidden-input"
                                        accept="image/*"
                                        ref={el => { fileInputRefs.current[entry.id] = el; }}
                                        onChange={e => handleImageUpload(entry.id, e.target.files[0])}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="photo-caption">
                            {editMode ? (
                                <input
                                    type="text"
                                    defaultValue={entry.caption || ""}
                                    placeholder="Pie de foto..."
                                    onClick={e => e.stopPropagation()}
                                    onBlur={e => handleEntryChange(entry.id, "caption", e.target.value)}
                                />
                            ) : (
                                entry.caption && <span className="readonly-caption">{entry.caption}</span>
                            )}
                        </div>
                        <div className="photo-description">
                            {editMode ? (
                                <textarea
                                    defaultValue={entry.description || ""}
                                    placeholder="Pequeña descripción de este momento..."
                                    onClick={e => e.stopPropagation()}
                                    onBlur={e => handleEntryChange(entry.id, "description", e.target.value)}
                                />
                            ) : (
                                entry.description && <p className="readonly-description">{entry.description}</p>
                            )}
                        </div>
                    </div>
                ),
                back: (
                    <div className="pg-content pg-text">
                        <div className="entry-header">Capítulo {ROMAN[i] || i + 1}</div>
                        {editMode ? (
                            <input
                                className="entry-title"
                                type="text"
                                defaultValue={entry.title || ""}
                                placeholder="Título del momento..."
                                onClick={e => e.stopPropagation()}
                                onBlur={e => handleEntryChange(entry.id, "title", e.target.value)}
                            />
                        ) : (
                            entry.title && <h3 className="readonly-title">{entry.title}</h3>
                        )}
                        {editMode ? (
                            <textarea
                                className="entry-body"
                                defaultValue={entry.body || ""}
                                placeholder="Escribe aquí tu recuerdo, lo que sentiste, lo que viviste en ese instante..."
                                onClick={e => e.stopPropagation()}
                                onBlur={e => handleEntryChange(entry.id, "body", e.target.value)}
                            />
                        ) : (
                            <p className="readonly-body">{entry.body || ""}</p>
                        )}
                        <div className="entry-date">
                            <span className="orn">✧</span>
                            {editMode ? (
                                <input
                                    type="text"
                                    defaultValue={entry.date_text || ""}
                                    placeholder="Fecha o lugar..."
                                    onClick={e => e.stopPropagation()}
                                    onBlur={e => handleEntryChange(entry.id, "date_text", e.target.value)}
                                />
                            ) : (
                                entry.date_text && <span className="readonly-date">{entry.date_text}</span>
                            )}
                        </div>
                    </div>
                )
            });
        });

        // End leaf
        leaves.push({
            front: (
                <div className="pg-content pg-end">
                    <div className="orn">✦ ✧ ✦ ✧ ✦</div>
                    <div className="fin">Fin</div>
                    <div className="orn">✦ ✧ ✦ ✧ ✦</div>
                </div>
            ),
            back: (
                <div className="pg-content pg-end">
                    <p style={{ fontFamily: "'Great Vibes',cursive", fontSize: "1.3rem", color: "var(--dusty-rose)", opacity: .3 }}>
                        Hecho con amor ✿
                    </p>
                </div>
            )
        });

        return leaves;
    }

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Abriendo el libro...</p>
            </div>
        );
    }

    const leaves = buildLeaves();

    return (
        <>
            <div className="particles" id="particles"></div>

            <div className="title-section">
                <h1>Nuestro Libro</h1>
                <p className="sub">
                    {editMode ? "✎ Modo edición" : "Pasa las páginas ✦"}
                </p>
            </div>

            {/* Save indicator — only in edit mode */}
            {editMode && (
                <div className={`save-indicator ${saving ? "saving" : "saved"}`}>
                    {saving ? "✎ Guardando..." : "✓ Guardado"}
                </div>
            )}

            <div className="book-scene">
                <div className="book">
                    <div className="left-cover"></div>
                    {leaves.map((leaf, i) => {
                        const isFlipped = i < currentPage;
                        const zIndex = isFlipped ? i + 1 : leaves.length - i;

                        return (
                            <div
                                key={i}
                                className={`page ${isFlipped ? "flipped" : ""}`}
                                style={{ zIndex }}
                                onClick={() => {
                                    if (i === currentPage) nextPage();
                                    else if (i === currentPage - 1) prevPage();
                                }}
                            >
                                <div className="page-front">
                                    {leaf.front}
                                    <div className="pg-num">{i * 2 + 1}</div>
                                </div>
                                <div className="page-back">
                                    {leaf.back}
                                    <div className="pg-num">{i * 2 + 2}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Navigation arrows */}
            <div className="nav nav-left">
                <button onClick={prevPage} disabled={currentPage <= 0}>❮</button>
            </div>
            <div className="nav nav-right">
                <button onClick={nextPage} disabled={currentPage >= totalLeaves}>❯</button>
            </div>

            {/* Page indicator dots */}
            <div className="page-indicator">
                {Array.from({ length: totalLeaves + 1 }, (_, i) => (
                    <button
                        key={i}
                        className={`dot ${i === currentPage ? "active" : ""}`}
                        onClick={() => goToPage(i)}
                    />
                ))}
            </div>

            {/* Add page — only in edit mode */}
            {editMode && (
                <button className="add-btn" onClick={addEntry} disabled={saving}>
                    <span className="plus">+</span> Nueva página
                </button>
            )}

            {/* Lightbox */}
            {lightboxSrc && (
                <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
                    <button className="close-lb" onClick={() => setLightboxSrc(null)}>✕</button>
                    <img src={lightboxSrc} alt="Vista ampliada" />
                </div>
            )}
        </>
    );
}

// Wrap in Suspense because useSearchParams needs it
export default function Book() {
    return (
        <Suspense fallback={
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Abriendo el libro...</p>
            </div>
        }>
            <BookInner />
        </Suspense>
    );
}

"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "./dibujos.css";

function DrawingsInner() {
    const searchParams = useSearchParams();
    const [drawings, setDrawings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editKey, setEditKey] = useState("");
    const [uploading, setUploading] = useState(false);
    const [lightboxSrc, setLightboxSrc] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const key = searchParams.get("edit");
        if (key) {
            setEditKey(key);
            fetch("/api/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key }),
            })
                .then(r => r.json())
                .then(data => {
                    setEditMode(data.valid);
                    setAuthChecked(true);
                })
                .catch(() => {
                    setEditMode(false);
                    setAuthChecked(true);
                });
        } else {
            setAuthChecked(true);
        }
        loadDrawings();
    }, [searchParams]);

    async function loadDrawings() {
        try {
            const res = await fetch("/api/drawings");
            const data = await res.json();
            setDrawings(data || []);
        } catch (err) {
            console.error("Error loading drawings:", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpload(file) {
        if (!file || !editMode) return;
        setUploading(true);
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
                const title = prompt("Título del dibujo:") || "";
                const description = prompt("Descripción (opcional):") || "";
                
                const saveRes = await fetch("/api/drawings", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "x-edit-key": editKey 
                    },
                    body: JSON.stringify({ url: data.url, title, description }),
                });
                const newDrawing = await saveRes.json();
                setDrawings(prev => [newDrawing, ...prev]);
            }
        } catch (e) {
            console.error("Upload error:", e);
        }
        setUploading(false);
    }

    async function handleDelete(id) {
        if (!editMode || !confirm("¿Seguro que quieres borrar este dibujo?")) return;
        try {
            await fetch(`/api/drawings?id=${id}`, {
                method: "DELETE",
                headers: { "x-edit-key": editKey },
            });
            setDrawings(prev => prev.filter(d => d.id !== id));
        } catch (e) {
            console.error("Delete error:", e);
        }
    }

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Cargando dibujos...</p>
            </div>
        );
    }

    return (
        <main className="drawings-container">
            <Link href="/" className="back-btn-global">
                ← Inicio
            </Link>

            <header className="drawings-header">
                <h1 className="drawings-title">Nuestros Dibujos</h1>

            </header>

            {authChecked && !editMode && searchParams.get("edit") && (
                <div className="edit-warning">
                    La clave no coincide con el modo edición. Revisa el valor de <code>EDIT_KEY</code> en el archivo <code>.env</code>.
                </div>
            )}

            <div className="drawings-grid">
                {editMode && (
                    <div className="drawing-card add-drawing-card" onClick={() => fileInputRef.current.click()}>
                        {uploading ? (
                            <div className="uploading-overlay">
                                <div className="spinner"></div>
                                <p>Subiendo...</p>
                            </div>
                        ) : (
                            <>
                                <div className="add-icon">+</div>
                                <h3 style={{ color: 'var(--gold-light)' }}>Añadir Dibujo</h3>
                            </>
                        )}
                        <input 
                            type="file" 
                            hidden 
                            ref={fileInputRef} 
                            accept="image/*" 
                            onChange={(e) => handleUpload(e.target.files[0])}
                        />
                    </div>
                )}

                {drawings.map(drawing => (
                    <div key={drawing.id} className="drawing-card">
                        <div className="drawing-img-wrapper" onClick={() => setLightboxSrc(drawing.url)}>
                            <img src={drawing.url} alt={drawing.title} />
                        </div>
                        <div className="drawing-info">
                            <h3>{drawing.title || "Sin título"}</h3>
                            <p>{drawing.description}</p>
                            {editMode && (
                                <button className="delete-btn" onClick={() => handleDelete(drawing.id)}>
                                    Borrar
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {!drawings.length && !editMode && (
                    <div className="drawing-empty">
                        No hay dibujos para mostrar todavía.
                    </div>
                )}
            </div>

            {lightboxSrc && (
                <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
                    <button className="close-lb" onClick={() => setLightboxSrc(null)}>✕</button>
                    <img src={lightboxSrc} alt="Dibujo ampliado" />
                </div>
            )}
        </main>
    );
}

export default function DrawingsPage() {
    return (
        <Suspense fallback={null}>
            <DrawingsInner />
        </Suspense>
    );
}

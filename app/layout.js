import "./globals.css";
import MusicPlayer from "./components/MusicPlayer";

export const metadata = {
  title: "Nuestro Libro de Recuerdos",
  description: "Un hermoso libro digital romántico para guardar tus recuerdos más especiales con fotos y textos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <MusicPlayer />
        {children}
      </body>
    </html>
  );
}

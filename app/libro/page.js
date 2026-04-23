import Link from "next/link";
import Book from "../components/Book";

export default function LibroPage() {
  return (
    <>
      <Link href="/" className="back-btn-global">
        ← Inicio
      </Link>
      <Book />
    </>
  );
}

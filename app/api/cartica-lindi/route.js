import { NextResponse } from "next/server";

const MESSAGE = {
  title: "Cartica Lindi",
  body: [
    "Amor, quiero expresarte mediante este mensaje que tú eres lo más bonito de mi mundo.",
    "Sé que no estás pasando por un buen momento emocionalmente, y quiero que sepas estoy aqui para ti.",
    "Puedes sentir todo lo que necesites sentir. Aquí estamos los dos, siempre para salir adelante, los dos juntitos.",
    "Entiendo todo lo que estás lidiando emocionalmente y todo lo que esto te puede estar afectando en este momento.",
    "No estás solita, amor, aquí estoy, siempre voy a estar contigo. Somos dos en esto.",
    "Siempre estaremos cogidos de la mano, siempre. Cuando no te sientas muy bien, vamos a estar los dos siempre.",
    "Créeme que sí, te amo con todo mi ser, amor. Eres quien da sentido a mi vida.",
  ],
  image: "/imagen_mensaje.png",
};

export async function GET() {
  return NextResponse.json(MESSAGE);
}

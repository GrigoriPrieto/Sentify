import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Log de depuración para verificar que las rutas se cargan
console.log("--- NEXT-AUTH ROUTE INITIALIZED ---");

const handler = NextAuth(authOptions);

/**
 * Es fundamental exportar GET y POST de esta manera.
 * Next.js detecta estas constantes para habilitar los endpoints de la API.
 * Si no se exportan, recibirás el error 405 (Method Not Allowed) 
 * o el SyntaxError de JSON vacío.
 */
export { handler as GET, handler as POST };
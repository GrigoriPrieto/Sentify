import { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          // Permisos esenciales para lectura y escritura (pública y privada)
          scope: "user-read-email user-read-private playlist-modify-public playlist-modify-private playlist-read-private",
          show_dialog: true
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Cuando el usuario inicia sesión, guardamos el accessToken y auditamos los permisos
      if (account) {
        console.log("--- NUEVO LOGIN DETECTADO ---");
        console.log("SCOPES CONCEDIDOS POR SPOTIFY:", account.scope);
        
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }: any) {
      // Pasamos el token del JWT a la sesión de la web
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
  // Secreto para firmar las cookies de sesión
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/", // Redirige a la home si hay errores
  },
};
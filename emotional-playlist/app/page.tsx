"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { processEmotion } from "./actions";

export default function Home() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Pantalla de Login (Si no hay sesión)
  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
        <h1 className="text-6xl font-bold mb-8 text-green-500">Sentify</h1>
        <p className="text-gray-400 mb-8 text-center max-w-md">
          Conecta tu Spotify para generar playlists basadas en tu estado de ánimo usando IA.
        </p>
        <button
          onClick={() => 
            signIn("spotify", { callbackUrl: "https://sentify.local.gd:3000" })
          }
          className="bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105"
        >
          Conectar con Spotify
        </button>
      </main>
    );
  }

  // Pantalla Principal (Usuario logueado)
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="flex justify-between items-center bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
          <div className="flex items-center gap-3">
            {session.user?.image && (
              <img 
                src={session.user.image} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border border-green-500"
              />
            )}
            <span className="font-medium">Hola, {session.user?.name} 👋</span>
          </div>
          <button 
            onClick={() => signOut()}
            className="text-xs text-gray-500 hover:text-white underline"
          >
            Cerrar sesión
          </button>
        </div>

        <h2 className="text-4xl font-bold">¿Cómo te sientes hoy?</h2>
        <p className="text-gray-400 text-lg">Escribe tus emociones y la IA buscará la música perfecta.</p>
        
        <form action={async (formData) => {
          setLoading(true);
          try {
            const res = await processEmotion(formData);
            if (res.success) {
              setResult(res.data);
            } else {
              alert(res.error || "Algo salió mal");
            }
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        }} className="space-y-4">
          <textarea
            name="emotion"
            required
            placeholder="Ej: Me siento con mucha energía para entrenar pero quiero algo de techno oscuro..."
            className="w-full h-40 p-4 rounded-xl bg-gray-900 border border-gray-800 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none resize-none transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg shadow-green-500/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin text-xl">⏳</span> Analizando tus vibras...
              </span>
            ) : (
              "Generar Playlist Mágica ✨"
            )}
          </button>
        </form>

        {/* Visualización del resultado de Groq */}
        {result && (
          <div className="mt-8 p-6 bg-gray-900 rounded-xl border border-green-500/30 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
              <p className="text-green-500 font-mono text-sm tracking-widest">ANÁLISIS DE IA COMPLETADO</p>
              <span className="bg-green-500/10 text-green-500 text-[10px] px-2 py-1 rounded border border-green-500/20">
                Llama-3-Groq
              </span>
            </div>
            <pre className="text-xs text-gray-300 overflow-auto p-4 bg-black/50 rounded-lg border border-gray-800">
              {JSON.stringify(result, null, 2)}
            </pre>
            <p className="mt-4 text-sm text-gray-500 italic text-center">
              Próximo paso: Convertir este análisis en una playlist real...
            </p>
            <a href={result.playlistUrl} 
            target="_blank" 
            className="mt-4 block w-full text-center py-3 bg-green-500 text-black font-bold rounded-full hover:bg-white transition-all">
              Abrir Playlist en Spotify 🎧
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
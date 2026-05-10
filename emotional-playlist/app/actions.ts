"use server";
import { Groq } from "groq-sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function processEmotion(formData: FormData) {
  const session = (await getServerSession(authOptions)) as any;
  
  if (!session?.accessToken) {
    return { success: false, error: "No hay token de acceso." };
  }

  const emotion = formData.get("emotion") as string;
  console.log("--- INICIANDO PROCESO PARA: " + emotion + " ---");

  try {
    // 1. ANÁLISIS DE IA
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Responde en JSON: {'mood': '...', 'explanation': '...', 'genres': ['...']}" }, 
        { role: "user", content: emotion }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });
    
    const ai = JSON.parse(completion.choices[0].message.content || "{}");
    const mainGenre = ai.genres?.[0] || "pop";

    // 2. BUSCAR CANCIONES (Añadimos mercado para asegurar compatibilidad)
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(mainGenre + " " + ai.mood)}&type=track&limit=10&market=from_token`, 
      { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    const searchData = await searchRes.json();
    const trackUris = searchData.tracks?.items?.map((t: any) => t.uri) || [];

    // 3. CREAR PLAYLIST
    const createRes = await fetch(`https://api.spotify.com/v1/me/playlists`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        name: `Sentify: ${ai.mood}`, 
        public: true,
        description: ai.explanation 
      })
    });
    
    const playlist = await createRes.json();
    if (!playlist.id) return { success: false, error: "No se pudo crear la lista." };

    console.log("Playlist creada (ID):", playlist.id);

    // 4. ESPERA DE SINCRONIZACIÓN (Mantenemos por seguridad)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 5. AÑADIR ITEMS (EL CAMBIO CLAVE: /items en lugar de /tracks)
    console.log("Añadiendo canciones vía endpoint /items...");
    const addRes = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/items`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ uris: trackUris })
    });
    
    // Logging detallado sugerido por tu fuente
    const status = addRes.status;
    const responseData = await addRes.json();
    
    console.log("ADD ITEMS STATUS:", status);
    console.log("ADD ITEMS RESPONSE:", JSON.stringify(responseData));

    if (status !== 201 && status !== 200) {
      return { 
        success: false, 
        error: `Error al añadir canciones: ${responseData.error?.message || 'Forbidden'}` 
      };
    }

    console.log("¡ÉXITO TOTAL! Snapshot:", responseData.snapshot_id);

    return {
      success: true,
      data: {
        ...ai,
        playlistUrl: `https://open.spotify.com/playlist/${playlist.id}`
      }
    };

  } catch (error) {
    console.error("ERROR CRÍTICO:", error);
    return { success: false, error: "Error en el servidor." };
  }
}
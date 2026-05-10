// lib/spotify.ts

// 1. Definimos la interfaz para que TypeScript sepa qué esperar
interface MoodData {
  mood: string;
  genres: string[];
  explanation: string; // <-- Añadimos esto para que no falle el build
}

export async function createPlaylist(accessToken: string, userId: string, moodData: MoodData) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `Sentify: ${moodData.mood}`,
        description: `Playlist generada por IA: ${moodData.explanation}`,
        public: false,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error en createPlaylist:", error);
    throw error;
  }
}

export async function addTracksToPlaylist(accessToken: string, playlistId: string, trackUris: string[]) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: trackUris,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error en addTracksToPlaylist:", error);
    throw error;
  }
}
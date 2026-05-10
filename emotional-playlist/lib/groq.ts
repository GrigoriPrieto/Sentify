import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function analyzeSentiment(userText: string) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Eres un experto en psicología musical. Analiza el sentimiento del usuario y devuelve SOLO un objeto JSON con: 
        1. mood (un string)
        2. seed_genres (3 géneros musicales de Spotify separados por comas)
        3. target_energy (de 0.0 a 1.0)
        4. target_valence (felicidad, de 0.0 a 1.0)`
      },
      {
        role: "user",
        content: userText,
      },
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
  });

  return JSON.parse(chatCompletion.choices[0].message.content || "{}");
}
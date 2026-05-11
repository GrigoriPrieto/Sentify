# 🎵 Sentify: AI-Powered Mood Playlists

> **Live Demo:** [https://sentify-blond.vercel.app](https://sentify-blond.vercel.app)

**Sentify** es una aplicación web inteligente que transforma tus emociones en música. Utilizando el modelo de lenguaje **Llama 3.3 de Groq**, la app analiza cómo te sientes y genera automáticamente una playlist personalizada en tu cuenta de **Spotify**.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Spotify API](https://img.shields.io/badge/Spotify-1DB954?style=for-the-badge&logo=spotify&logoColor=white)
![Groq Cloud](https://img.shields.io/badge/Groq-f55036?style=for-the-badge&logo=ai&logoColor=white)

---

## 🚀 Características

- 🧠 **Análisis de Sentimiento:** Procesamiento de lenguaje natural mediante Groq para identificar moods y subgéneros musicales.
- 🔐 **Autenticación Segura:** Integración con NextAuth y Spotify OAuth para acceso seguro a la cuenta del usuario.
- ⚡ **Generación en Tiempo Real:** Creación instantánea de playlists y adición de tracks optimizada.
- 🛠️ **Arquitectura Robusta:** Implementación de Server Actions y manejo de errores críticos de API (Fix de endpoints deprecated).

## 🛠️ Stack Tecnológico

- **Frontend/Backend:** [Next.js 15](https://nextjs.org/) (App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **IA:** [Groq SDK](https://groq.com/) (Llama 3.3 70b Versatile)
- **Auth:** [NextAuth.js](https://next-auth.js.org/)
- **Estilos:** Tailwind CSS 4

---

## 🔧 Desafíos Técnicos y Soluciones

### El "Spotify 403 Forbidden" Bug
Durante el desarrollo, nos enfrentamos a un error persistente al intentar añadir canciones a las playlists creadas. Tras una investigación profunda, descubrimos que las aplicaciones nuevas en modo desarrollo de Spotify están forzando la migración del endpoint legacy `/tracks` hacia el nuevo endpoint `/items`.

**Solución aplicada:**
Se migró toda la lógica de edición de playlists al nuevo endpoint `/v1/playlists/{id}/items` y se implementó un sistema de "retry" con delay de sincronización de 1.5s para asegurar la propagación de permisos en los servidores de Spotify.

---

## 🚦 Configuración Local

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/tu-usuario/sentify.git](https://github.com/tu-usuario/sentify.git)
   cd sentify

2. **Insalar dependencias**
    ```bash
    npm install

3. **Variables de Entorno (`.env.local`):**
   Crea un archivo con las siguientes claves:
   ```env
   GROQ_API_KEY=tu_api_key_de_groq
   SPOTIFY_CLIENT_ID=tu_client_id
   SPOTIFY_CLIENT_SECRET=tu_client_secret
   NEXTAUTH_SECRET=una_palabra_aleatoria
   NEXTAUTH_URL=http://localhost:3000

4. **Ejecutar en desarrollo**
    ```bash
    npm run dev

---

## 📸 Demo

<img width="553" height="344" alt="image" src="https://github.com/user-attachments/assets/ee69c8f6-b06a-4e1e-8fed-e2a3e35d3207" />

---

<img width="832" height="575" alt="image" src="https://github.com/user-attachments/assets/9d0c7b02-60c8-48c6-a427-002528f4326e" />

---

<img width="719" height="895" alt="image" src="https://github.com/user-attachments/assets/544bd2fd-aecc-47b5-8e9b-b6df39ee280b" />

---

<img width="1363" height="751" alt="image" src="https://github.com/user-attachments/assets/e627cc37-8782-4ea4-b2bb-4f19c897dedd" />

---





## 🤝 Contribuciones

Las sugerencias y pull requests son bienvenidos. Para cambios importantes, por favor abre un issue primero para discutir lo que te gustaría cambiar.

---

Desarrollado con ❤️ por **Grigori** 

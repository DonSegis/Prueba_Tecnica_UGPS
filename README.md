

## 📌 Descripción

Metacritic's Greatest es una aplicación web desarrollada con **Next.js** que permite a los usuarios buscar y visualizar información sobre videojuegos, utilizando la API pública de **RAWG**.

Los usuarios pueden:

- Explorar una lista de videojuegos ordenados por puntuación de Metacritic.
- Filtrar juegos por **año, género, plataforma, tags y desarrollador**.
- Realizar búsquedas personalizadas por nombre de videojuego.
- Ver detalles de cada juego, incluyendo **título, género, puntuación, plataformas, año de lanzamiento y trailers** (si están disponibles).

---

## 🚀 Tecnologías utilizadas

- **Next.js**: Framework basado en React que mejora el rendimiento con **SSR (Server-Side Rendering)** y **SSG (Static Site Generation)**.
- **TypeScript**: Mejora la escalabilidad y mantenimiento del código.
- **RAWG API**: Fuente de datos de videojuegos.
- **Tailwind CSS & shadcn/ui**: Estilización moderna y componentes de UI reutilizables.
- **Lucide React**: Íconos minimalistas para mejorar la experiencia visual.
- **Framer Motion**: Animaciones fluidas para mejorar la UX.

---

## 🎥 Demo en vivo

Puedes ver la aplicación desplegada en el siguiente enlace: (https://pruebatecnicaugps-production.up.railway.app)

---

## 🛠 Instalación y configuración

Para ejecutar el proyecto localmente, sigue estos pasos:

### 1️⃣ Clonar el repositorio

```bash
 git clone https://github.com/DonSegis/Prueba_Tecnica_UGPS.git
 cd Prueba_Tecnica_UGPS
```

### 2️⃣ Instalar dependencias

```bash
 npm install  # O yarn install
```

### 3️⃣ Configurar variables de entorno

Crea un archivo **`.env.local`** en la raíz del proyecto y añade tu clave de API de RAWG:

```env
NEXT_PUBLIC_BASE_URL = https://api.rawg.io/api
NEXT_PUBLIC_RAWG_API_KEY=tu_api_key
```

> **Nota:** Puedes obtener una API Key en [RAWG API](https://rawg.io/apidocs)

### 4️⃣ Ejecutar en desarrollo

```bash
 npm run dev  # O yarn dev
```

La aplicación estará disponible en **http://localhost:3000**

## 📂 Estructura del proyecto

```
├── pages/            # Rutas principales
│   ├── page.tsx     # Página principal
│   ├── game/[id]/page.tsx # Página de detalles del juego
├── components/        # Componentes reutilizables de UI
│   ├── GameCard.tsx   # Tarjeta de juego
│   ├── GameFilters.tsx # Filtros de búsqueda
├── config/           # Configuración de la API RAWG
├── README.md         # Documentación del proyecto
```

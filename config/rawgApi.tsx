import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Definir tipos para la API
interface Game {
  clip: any;
  description_raw: any;
  tags: any;
  developers: any;
  id: number;
  name: string;
  released: string;
  background_image: string;
  rating: number;
  metacritic: number;
  platforms: { platform: { id: number; name: string } }[];
  genres: { id: number; name: string }[];
}

interface ApiResponse<T> {
  results: T;
  next: string | null;
  previous: string | null;
}

// Configuración de Axios
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

// Obtiene la lista de los 28 juegos mejor calificados en Metacritic

export const getTopRatedGames = async (
  page: number = 1
): Promise<{ games: Game[]; nextPage: number | null }> => {
  try {
    const response = await api.get<ApiResponse<Game[]>>("/games", {
      params: {
        ordering: "-metacritic",
        page_size: 28,
        page: page,
      },
    });
    return {
      games: response.data.results.filter((game) => game.metacritic !== null),

      nextPage: response.data.next ? page + 1 : null,
    };
  } catch (error) {
    console.error("Error al obtener los juegos mejor calificados:", error);
    return { games: [], nextPage: null };
  }
};

// Obtiene datos de las catgotias de los filtros

export const getAvailableFilters = async () => {
  try {
    const [genresRes, platformsRes, developersRes] = await Promise.all([
      api.get("/genres"),
      api.get("/platforms"),
      api.get("/developers", { params: { metacritic: "1,100" } }),
    ]);

    return {
      genres: genresRes.data.results.map((g: { id: number; name: string }) => ({
        id: g.id,
        name: g.name,
      })),
      platforms: platformsRes.data.results.map(
        (p: { id: number; name: string }) => ({
          id: p.id,
          name: p.name,
        })
      ),
      developers: developersRes.data.results.map(
        (d: { id: number; name: string }) => ({
          id: d.id,
          name: d.name,
        })
      ),
    };
  } catch (error) {
    console.error("Error al obtener los filtros disponibles:", error);
    return { genres: [], platforms: [], developers: [] };
  }
};

// Obtiene los juegos filtrados según los parámetros proporcionados

export const getFilteredGames = async (
  filters: Record<string, any>,
  page: number = 1
): Promise<{ games: Game[]; nextPage: number | null }> => {
  try {
    const response = await api.get<ApiResponse<Game[]>>("/games", {
      params: {
        ordering: "-metacritic",
        dates: filters.year
          ? `${filters.year}-01-01,${filters.year}-12-31`
          : undefined,
        genres: filters.genre
          ? filters.genre.toLowerCase().replace(" ", "-")
          : undefined,
        platforms: filters.platform ? filters.platform.toString() : undefined,
        developers: filters.developer
          ? filters.developer.toLowerCase().replace(" ", "-")
          : undefined,
        // search: filters.search,
        search: filters.search
          ? filters.search.replace(/\s+/g, "+")
          : undefined,

        page_size: 28,
        page: page,
      },
    });
    return {
      games: response.data.results.filter((game) => game.metacritic !== null),
      nextPage: response.data.next ? page + 1 : null,
    };
  } catch (error) {
    console.error("Error al obtener juegos filtrados:", error);
    return { games: [], nextPage: null };
  }
};

//Obtiene los detalles de un juego por su ID

export const getGameDetailsById = async (
  gameId: string
): Promise<Game | null> => {
  try {
    const response = await api.get<Game>(`/games/${gameId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener detalles del juego:", error);
    return null;
  }
};

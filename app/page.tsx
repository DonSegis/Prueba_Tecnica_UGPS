"use client";

import { GameCard } from "@/components/GameCard";
import { GameFilters } from "@/components/GameFilters";
import { FilterParams, Game } from "@/app/types";
import { useEffect, useState } from "react";
import { getTopRatedGames, getFilteredGames } from "@/config/rawgApi";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [filters, setFilters] = useState<FilterParams>({});
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true); // Inicia la carga
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Determina qué función de API usar (juegos filtrados o top-rated)
      const { games, nextPage } =
        Object.keys(filters).length === 0
          ? await getTopRatedGames(page)
          : await getFilteredGames(filters, page);

      // Función para mapear los datos del juego
      const mapGames = (game: any): Game => ({
        id: game.id,
        title: game.name,
        metacritic: game.metacritic,
        released: game.released,
        background_image: game.background_image,
        platforms:
          game.platforms?.map((p: any) => ({
            id: p.platform.id,
            name: p.platform.name,
          })) || [],
        genres:
          game.genres?.map((g: any) => ({ id: g.id, name: g.name })) || [],
        developers:
          game.developers?.map((d: any) => ({
            id: d.id,
            name: d.name,
          })) || [],
        tags:
          game.tags?.map((t: any) => ({
            id: t.id,
            name: t.name,
          })) || [],
        description: game.description_raw || "No description available",
        trailer: game.clip?.clip || "",
      });

      // Aplicar el mapeo y actualizar estados
      setFilteredGames(games.map(mapGames));
      setNextPage(nextPage);
      setIsLoading(false); // Finaliza la carga
    };

    fetchGames();
  }, [filters, page]);

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
    setPage(1); // Reinicia la paginación cuando se aplican nuevos filtros
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-[1600px]">
        <h1 className="mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Metacritic’s Greatest
        </h1>
        <p className="mb-8 text-md text-muted-foreground">
          The Ultimate Game Rankings
        </p>
        <GameFilters onFilterChange={handleFilterChange} />

        {/* Loader cuando los juegos están cargando */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            <p className="mt-4 text-white text-lg font-semibold">
              Loading games...
            </p>
          </div>
        ) : filteredGames.length === 0 ? (
          // Mensaje cuando no hay juegos en el filtrado
          <div className="flex flex-col items-center justify-center h-screen">
            <p className="mt-4 text-white text-lg font-semibold">
              No se encontraron juegos.
            </p>
          </div>
        ) : (
          // Si hay juegos, los muestra
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}

        {/* Paginación */}
        {filteredGames.length >= 28 && (
          <div className="flex justify-center mt-8 gap-4 items-center">
            {page > 1 && (
              <Button
                onClick={() => setPage(page - 1)}
                variant="outline"
                className="rounded-full px-6 py-2"
              >
                Previous
              </Button>
            )}
            <span className="text-lg font-semibold">Page {page}</span>
            {nextPage && (
              <Button
                onClick={() => setPage(page + 1)}
                variant="outline"
                className="rounded-full px-6 py-2"
              >
                Next
              </Button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

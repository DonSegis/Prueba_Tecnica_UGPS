"use client";

import { Game } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Gamepad2, Building2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getGameDetailsById } from "@/config/rawgApi";

// Obtiene la información desde la API usando el `id` del juego.
export default function GamePage({ params }: { params: { id: string } }) {
  const [game, setGame] = useState<Game | null>(null);
  console.log("Game ID en GamePage:", params.id);

  useEffect(() => {
    //Función asíncrona para obtener los detalles del juego desde la API.
    const fetchGameDetails = async () => {
      const gameData = await getGameDetailsById(params.id);
      if (gameData) {
        setGame({
          id: gameData.id,
          title: gameData.name,
          metacritic: gameData.metacritic,
          released: gameData.released,
          background_image: gameData.background_image,
          platforms:
            gameData.platforms?.map((p: any) => ({
              id: p.platform.id,
              name: p.platform.name,
            })) || [],
          genres:
            gameData.genres?.map((g: any) => ({
              id: g.id,
              name: g.name,
            })) || [],
          developers:
            gameData.developers?.map((d: any) => ({
              id: d.id,
              name: d.name,
            })) || [],
          tags:
            gameData.tags?.map((t: any) => ({
              id: t.id,
              name: t.name,
            })) || [],
          description: gameData.description_raw || "No description available",
          trailer: gameData.clip?.clip || "",
        });
      }
    };

    if (params.id) {
      fetchGameDetails();
    }
  }, [params.id]);

  {
    // Loader cuando los detalles están cargando
  }
  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-primary text-lg font-semibold">
          Loading game details...
        </p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-32">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* imagen principal del juego */}

        <div className="relative aspect-video overflow-hidden rounded-2xl">
          <Image
            src={game.background_image}
            alt={game.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col gap-4">
          {/* información del juego */}

          <h1 className="text-4xl font-bold">{game.title}</h1>

          {/* géneros */}

          <div className="flex flex-wrap gap-2">
            {game.genres.map((genre) => (
              <Badge
                key={genre.id}
                variant="secondary"
                className="rounded-full px-4 py-1"
              >
                {genre.name}
              </Badge>
            ))}
          </div>

          {/* información en columnas */}

          <div className="grid gap-4 sm:grid-cols-2">
            {/* puntuación Metacritic */}

            <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">Metacritic Score:</span>
              <span>{game.metacritic || "N/A"}</span>
            </div>

            {/* Fecha de lanzamiento */}

            <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-2">
              <Calendar className="h-5 w-5" />
              <span className="font-semibold">Release Date:</span>
              <span>
                {game.released
                  ? new Date(game.released).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            {/* plataformas disponibles */}
            <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-2">
              <Gamepad2 className="h-5 w-5" />
              <span className="font-semibold">Platforms:</span>
              <span>
                {game.platforms.map((p) => p.name).join(", ") || "N/A"}
              </span>
            </div>
            {/* desarrolladores */}
            <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-2">
              <Building2 className="h-5 w-5" />
              <span className="font-semibold">Developer:</span>
              <span>
                {game.developers?.map((d) => d.name).join(", ") || "N/A"}
              </span>
            </div>
          </div>
          {/* descripción del juego */}
          <p className="mt-4 rounded-xl bg-secondary/50 p-4 text-lg">
            {game.description}
          </p>
          {/* tags del juego */}
          <div className="mt-4">
            <h2 className="mb-2 text-xl font-semibold">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {game.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="rounded-full px-4 py-1"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

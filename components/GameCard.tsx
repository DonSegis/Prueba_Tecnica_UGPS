"use client";

import { Game } from "@/app/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Calendar } from "lucide-react";

interface GameCardProps {
  game: Game;
}

//Componente que representa una tarjeta con contenido relevante sobre el juego

export function GameCard({ game }: GameCardProps) {
  if (!game) {
    return <p className="text-red-500">Error: No se pudo cargar el juego.</p>;
  }
  return (
    <Link href={`/game/${game.id.toString()}`}>
      <Card className="group relative overflow-hidden rounded-xl border-0 bg-card/50">
        {/* imagen principal */}

        <div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
          {game.background_image ? (
            <Image
              src={game.background_image}
              alt={game.title || "Unknown title"}
              fill
              className="object-cover transition-all duration-300 group-hover:scale-110 group-hover:blur-sm"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-700 text-white">
              No Image Available
            </div>
          )}

          {/* plataformas del juego */}

          <div className="absolute bottom-2 left-2 flex gap-1">
            {game.platforms?.length > 5 ? (
              // Si hay muchas plataformas, se anima horizontalmente con Framer Motion

              <motion.div
                className="flex gap-1"
                animate={{ x: [0, -100, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              >
                {game.platforms.map((platform) => (
                  <Badge
                    key={platform.id}
                    variant="secondary"
                    className="rounded-full bg-black/50 px-3 py-1 text-xs backdrop-blur-sm"
                  >
                    {platform.name}
                  </Badge>
                ))}
              </motion.div>
            ) : (
              // Si hay pocas plataformas, se muestran estáticas

              game.platforms.map((platform) => (
                <Badge
                  key={platform.id}
                  variant="secondary"
                  className="rounded-full bg-black/50 px-3 py-1 text-xs backdrop-blur-sm"
                >
                  {platform.name}
                </Badge>
              ))
            )}
          </div>

          {/* puntucaion metacritic */}

          {game.metacritic ? (
            <div className="absolute right-2 top-2">
              <Badge
                variant="secondary"
                className="flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 backdrop-blur-sm"
              >
                <Trophy className="h-4 w-4 text-yellow-500" />
                {game.metacritic}
              </Badge>
            </div>
          ) : null}
        </div>

        {/* info del juego */}

        <div className="p-4">
          <h3 className="text-lg font-bold leading-tight tracking-tight text-white group-hover:text-primary">
            {game.title || "Unknown Title"}
          </h3>

          {/* Panel de información adicional que se muestra al pasar el mouse*/}

          <div className="mt-2 flex flex-col gap-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Release date:{" "}
                {game.released
                  ? new Date(game.released).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {game.genres?.length > 0 ? (
                game.genres.map((genre) => (
                  <Badge
                    key={genre.id}
                    variant="outline"
                    className="rounded-full border-zinc-700 bg-transparent px-3 py-1 text-xs font-medium"
                  >
                    {genre.name}
                  </Badge>
                ))
              ) : (
                <Badge className="rounded-full border-zinc-700 px-3 py-1 text-xs">
                  No Genre Info
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {game.tags?.length > 0 ? (
                game.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="rounded-full border-zinc-700 bg-transparent px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {tag.name}
                  </Badge>
                ))
              ) : (
                <Badge className="rounded-full border-zinc-700 px-3 py-1 text-xs">
                  No Tags
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

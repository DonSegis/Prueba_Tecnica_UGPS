"use client";

import { FilterParams } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X, Check } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect, useCallback } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAvailableFilters } from "@/config/rawgApi";
import { cn } from "@/lib/utils";

interface GameFiltersProps {
  onFilterChange: (filters: FilterParams) => void;
}

export function GameFilters({ onFilterChange }: GameFiltersProps) {
  const [filters, setFilters] = useState<FilterParams>({});
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [platforms, setPlatforms] = useState<{ id: number; name: string }[]>(
    []
  );
  const [developers, setDevelopers] = useState<{ id: number; name: string }[]>(
    []
  );

  // Genera un array de los últimos 25 años, comenzando desde el año actual
  const years = Array.from(
    { length: 25 },
    (_, i) => new Date().getFullYear() - i
  );

  // Obtiene los filtros disponibles desde la API
  useEffect(() => {
    const fetchFilters = async () => {
      const { genres, platforms, developers } = await getAvailableFilters();
      setGenres(genres);
      setPlatforms(platforms);
      setDevelopers(developers);
    };

    fetchFilters();
  }, []);

  //Maneja el cambio de filtros y permite deseleccionar al hacer clic nuevamente

  const handleFilterChange = useCallback(
    (key: keyof FilterParams, value: string) => {
      setFilters((prevFilters) => {
        const newFilters = { ...prevFilters };
        if (newFilters[key] === value) {
          delete newFilters[key]; // Si ya estaba seleccionado, lo elimina
        } else {
          newFilters[key] = value as any;
        }

        // Ejecuta la actualización con un pequeño retraso para evitar actualizaciones durante el renderizado
        setTimeout(() => {
          onFilterChange({ ...newFilters });
        }, 0);

        return newFilters;
      });
    },
    [onFilterChange]
  );

  //Maneja el campo de búsqueda y permite limpiarlo

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters };
    if (!value.trim()) {
      delete newFilters.search;
    } else {
      newFilters.search = value;
    }
    setFilters(newFilters);

    setTimeout(() => {
      onFilterChange(newFilters);
    }, 0);
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Campo de búsqueda */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search games..."
          className="rounded-full pl-10 pr-10"
          value={filters.search || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        {filters.search && (
          <button
            onClick={() => handleSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <Sheet>
          {/* Modal para filtros en dispositivos móviles */}
          <SheetTrigger asChild>
            <Button variant="outline" className="rounded-full lg:hidden">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent className="max-h-[80vh] overflow-y-auto">
            <div className="mt-4 flex flex-col gap-4">
              <FilterButtons
                years={years}
                genres={genres}
                platforms={platforms}
                developers={developers}
                selectedFilters={filters}
                onChange={handleFilterChange}
              />
            </div>
          </SheetContent>
        </Sheet>
        {/* Botones de filtro visibles en pantallas grandes */}
        <div className="hidden gap-2 lg:flex">
          <FilterButtons
            years={years}
            genres={genres}
            platforms={platforms}
            developers={developers}
            selectedFilters={filters}
            onChange={handleFilterChange}
          />
        </div>
      </div>
    </div>
  );
}

// Componente que renderiza los botones de filtros disponibles.

function FilterButtons({
  years,
  genres,
  platforms,
  developers,
  selectedFilters,
  onChange,
}: {
  years: number[];
  genres: { id: number; name: string }[];
  platforms: { id: number; name: string }[];
  developers: { id: number; name: string }[];
  selectedFilters: FilterParams;
  onChange: (key: keyof FilterParams, value: string) => void;
}) {
  return (
    <>
      <FilterPopover
        title="Year"
        items={years.map((year) => ({ id: year, name: year.toString() }))}
        selected={selectedFilters.year}
        onChange={(value) => onChange("year", value)}
      />
      <FilterPopover
        title="Genre"
        items={genres}
        selected={selectedFilters.genre}
        onChange={(value) => onChange("genre", value)}
      />
      <FilterPopover
        title="Platform"
        items={platforms}
        selected={selectedFilters.platform}
        onChange={(value) => onChange("platform", value)}
      />
      <FilterPopover
        title="Developer"
        items={developers}
        selected={selectedFilters.developer}
        onChange={(value) => onChange("developer", value)}
      />
    </>
  );
}

//Componente que representa un Popover para seleccionar filtros.

function FilterPopover({
  title,
  items,
  selected,
  onChange,
}: {
  title: string;
  items: { id: number; name: string }[];
  selected?: string;
  onChange: (value: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[140px] rounded-full justify-between whitespace-normal",
            selected && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {selected
            ? items.find((item) => item.id.toString() === selected)?.name ||
              title
            : title}
          {selected && (
            <X
              className="ml-2 h-4 w-4"
              onClick={(e) => {
                e.stopPropagation();
                onChange(selected);
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[140px] p-0 max-h-60 overflow-y-auto">
        <div className="flex flex-col">
          {items.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "justify-start whitespace-normal break-words px-3 py-2 text-left w-full",
                selected === item.id.toString() && "bg-primary/10"
              )}
              onClick={() => onChange(item.id.toString())}
            >
              {selected === item.id.toString() && (
                <Check className="h-4 w-4 mr-2 shrink-0" />
              )}
              <span className="flex-1">{item.name}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

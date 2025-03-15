export interface Game {
  id: number;
  title: string;
  metacritic: number;
  released: string;
  background_image: string;
  genres: Genre[];
  platforms: Platform[];
  developers: Developer[];
  tags: Tag[];
  description?: string;
  trailer?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Platform {
  id: number;
  name: string;
}

export interface Developer {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface FilterParams {
  year?: string;
  genre?: string;
  platform?: string;
  developer?: string;
  tags?: string[];
  search?: string;
}

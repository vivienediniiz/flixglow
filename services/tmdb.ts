const TMDB_API_KEY = 'c3bcc424e941fcf20e2627eb440a4547'; // Your API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  video?: boolean;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  origin_country: string[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Genre[];
  production_companies: any[];
  videos?: {
    results: {
      key: string;
      type: string;
      site: string;
      name: string;
    }[];
  };
}

class TMDBService {
  private async fetchFromTMDB(endpoint: string) {
    const response = await fetch(`${BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data from TMDB');
    }
    return response.json();
  }

  async getTrending(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/trending/movie/week');
    return data.results;
  }

  async getPopularMovies(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/movie/popular');
    return data.results;
  }

  async getPopularTVShows(): Promise<TVShow[]> {
    const data = await this.fetchFromTMDB('/tv/popular');
    return data.results;
  }

  async getNewReleases(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/movie/now_playing');
    return data.results;
  }

  async getTopRated(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/movie/top_rated');
    return data.results;
  }

  async getMovieDetails(id: number): Promise<MovieDetails> {
    const data = await this.fetchFromTMDB(`/movie/${id}&append_to_response=videos`);
    return data;
  }

  async getTVDetails(id: number): Promise<any> {
    const data = await this.fetchFromTMDB(`/tv/${id}&append_to_response=videos`);
    return data;
  }

  async searchMovies(query: string): Promise<Movie[]> {
    const data = await this.fetchFromTMDB(`/search/movie&query=${encodeURIComponent(query)}`);
    return data.results;
  }

  async searchTVShows(query: string): Promise<TVShow[]> {
    const data = await this.fetchFromTMDB(`/search/tv&query=${encodeURIComponent(query)}`);
    return data.results;
  }

  async getGenres(): Promise<Genre[]> {
    const data = await this.fetchFromTMDB('/genre/movie/list');
    return data.genres;
  }

  getImageUrl(path: string, size: string = 'w500'): string {
    return path ? `${IMAGE_BASE_URL}/${size}${path}` : '';
  }

  getBackdropUrl(path: string, size: string = 'w1280'): string {
    return path ? `${IMAGE_BASE_URL}/${size}${path}` : '';
  }

  getYouTubeUrl(key: string): string {
    return `https://www.youtube.com/watch?v=${key}`;
  }
}

export const tmdbService = new TMDBService();
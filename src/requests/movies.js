import { tmdbRequest } from "./utils";

export function getMovieDetailsRequest(movieId) {
  return tmdbRequest(`/movie/${movieId}`)
}

export function getMovieCreditsRequest(movieId) {
  return tmdbRequest(`/movie/${movieId}/credits`)
}

export function getTrendingMoviesRequest() {
  return tmdbRequest('/trending/movie/day?language=en-US')
}

export function getPopularDataRequest() {
  return tmdbRequest('/movie/popular?language=en-US')
};

export function getBannerForFirstMovieRequest(movieData) {
  return tmdbRequest(`/movie/${movieData.results[0].id}/images`)
}

export function getBannerForSecondMovieRequest(movieData) {
  return tmdbRequest(`/movie/${movieData.results[1].id}/images`)
}

export function getGenresDataRequest() {
  return tmdbRequest('/genre/movie/list?language=en-US')
}

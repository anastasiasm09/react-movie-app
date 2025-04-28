import { requestOptions } from "./utils";

export function getMovieDetailsRequest(movieId) {
  return fetch(`https://api.themoviedb.org/3/movie/${movieId}`, requestOptions).then(res => res.json())
}

export function getMovieCreditsRequest(movieId) {
  return fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits`, requestOptions).then(res => res.json())
}

export function getTrendingMoviesRequest() {
  return fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', requestOptions).then(res => res.json())
}

export function getPopularDataRequest() {
  return fetch('https://api.themoviedb.org/3/movie/popular?language=en-US', requestOptions).then(res => res.json())
};

export function getBannerForFirstMovieRequest(movieData) {
  return fetch(`https://api.themoviedb.org/3/movie/${movieData.results[0].id}/images`, requestOptions).then(res => res.json())
}

export function getBannerForSecondMovieRequest(movieData) {
  return fetch(`https://api.themoviedb.org/3/movie/${movieData.results[1].id}/images`, requestOptions).then(res => res.json())
}

export function getGenresDataRequest() {
  return fetch('https://api.themoviedb.org/3/genre/movie/list?language=en-US', requestOptions).then(res => res.json())
}

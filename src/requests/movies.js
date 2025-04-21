import { requestOptions } from "./utils";

export function getMovieDetailsRequest(movieId) {
  return fetch(`https://api.themoviedb.org/3/movie/${movieId}`, requestOptions).then(res => res.json())
}

export function getMovieCreditsRequest(movieId) {
  return fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits`, requestOptions).then(res => res.json())
}
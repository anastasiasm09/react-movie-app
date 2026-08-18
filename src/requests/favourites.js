import { getRequestOptions, tmdbRequest } from "./utils"

export function addToFavoritesRequest({ sessionId, accountId, movieId, isFavourite }) {

    return fetch(`https://api.themoviedb.org/3/account/${accountId}/favorite?session_id=${sessionId}`, getRequestOptions({
        method: 'POST',
        body: JSON.stringify({
            media_type: "movie",
            media_id: movieId,
            favorite: isFavourite,
        }),
    }))
        .then(res => {
            return res.json()
        });
}

export async function getListOfFavorites(accountId) {
    try {
        const data = await tmdbRequest(`/account/${accountId}/favorite/movies`);
        const getFavorites = data.results.map((movie) => movie.id);
        return getFavorites;

    } catch (error) {
        console.error("Error getting request_token:", error);
        throw error;
    }
}

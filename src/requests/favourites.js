import { requestOptions } from "./utils"

export function addToFavoritesRequest({ sessionId, accountId, movieId, isFavourite }) {

    return fetch(`https://api.themoviedb.org/3/account/${accountId}/favorite?session_id=${sessionId}`, {
        ...requestOptions,
        method: 'POST',
        body: JSON.stringify({
            media_type: "movie",
            media_id: movieId,
            favorite: isFavourite,
        }),
    })
        .then(res => {
            return res.json()
        });
}

export async function getListOfFavorites(accountId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/account/${accountId}/favorite/movies`, requestOptions)

        if (!response.ok) {
            const errorMessage = `API Error ${response.status}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        const getFavorites = data.results.map((movie) => movie.id);
        return getFavorites;

    } catch (error) {
        console.error("Error getting request_token:", error);
        throw error;
    }
}
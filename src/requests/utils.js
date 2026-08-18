const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';

export const getToken = () => process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN;

export function getRequestOptions(options = {}) {
    const token = getToken();

    if (!token) {
        throw new Error('Missing NEXT_PUBLIC_TMDB_BEARER_TOKEN environment variable.');
    }

    return {
        ...options,
        method: options.method || 'GET',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    };
}

export async function tmdbRequest(path, options) {
    const response = await fetch(`${TMDB_API_BASE_URL}${path}`, getRequestOptions(options));
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.status_message || `TMDb API error ${response.status}`);
    }

    return data;
}

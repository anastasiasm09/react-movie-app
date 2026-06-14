export const getToken = () => process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN

export const requestOptions = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
    }
};

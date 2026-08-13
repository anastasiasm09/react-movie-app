import { useQuery } from "@tanstack/react-query";
import { getGenresDataRequest } from "../requests/movies";

export function useGenres() {
    const { data: genresData, isGenresLoading, isGenresError } = useQuery({
        queryKey: ['genres'],
        queryFn: () => getGenresDataRequest()
    });

    const genreMap = genresData?.genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
    }, {}) || {};

    return {  genreMap, isGenresLoading, isGenresError }
}
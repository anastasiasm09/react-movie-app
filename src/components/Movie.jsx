import { useParams, useSearchParams } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Image, Spacer } from "@heroui/react";
import { useEffect } from "react";
import { addToFavoritesRequest, getListOfFavorites } from "../requests/favourites"
import { getMovieCreditsRequest, getMovieDetailsRequest } from "../requests/movies";
import { getAccountId, getRequestToken, getSessionId } from "../requests/account";
import FavouriteButton from "./FavouriteButton";

export default function Movie() {
    const { id } = useParams();

    const storedAccountId = localStorage.getItem('accountId');
    const storedSessionId = localStorage.getItem('sessionId');

    const [searchParams, setSearch] = useSearchParams();

    const queryClient = useQueryClient();

    const { mutateAsync: addToFavorites } = useMutation({
        mutationFn: addToFavoritesRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allFavourites'] })
        },
    });

    useEffect(() => {
        const isApproved = searchParams.get("approved");
        const tokenFromUrl = searchParams.get("request_token");

        if (isApproved === 'true' && tokenFromUrl.length) {  //token to get session_id and account_id.
            const createSessionAndAddToFavorites = async () => {
                const sessionId = await getSessionId(tokenFromUrl);
                const accountId = await getAccountId(sessionId);
                localStorage.setItem('sessionId', sessionId)
                localStorage.setItem('accountId', accountId)

                addToFavorites({ sessionId, accountId, movieId: id })
                getListOfFavorites(accountId);
            }
            createSessionAndAddToFavorites();
        }
    }, [searchParams, id])


    const { data, isLoading, isError } = useQuery({
        queryKey: ['movieDetails', id],
        queryFn: () => getMovieDetailsRequest(id)
    });

    const { data: castData } = useQuery({
        queryKey: ['movieCast', id],
        queryFn: () => getMovieCreditsRequest(id),
        enabled: !!data
    });

    const { data: favouriteMovieIds } = useQuery({
        queryKey: ['allFavourites'],
        queryFn: () => getListOfFavorites(storedAccountId),
        enabled: !!storedAccountId,
        staleTime: 30 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
    });

    if (isLoading) return <p>'Loading...'</p>;
    if (isError) return <p>`'An error has occurred: ' ${+ isError.message}`</p>;

    const isFavouriteMovie = favouriteMovieIds?.includes(data.id);

    async function onAddToFavorite() { // generates request_token and redirects to TMDb.

        if (storedSessionId && storedAccountId) {
            addToFavorites({
                accountId: storedAccountId,
                sessionId: storedSessionId,
                movieId: id,
                isFavourite: true
            });
        } else {
            const currentUrl = window.location.href;
            const token = await getRequestToken();
            window.location.assign(`https://www.themoviedb.org/authenticate/${token}?redirect_to=${currentUrl}`);
        }
    }

    const onRemoveFromFavourite = () => {
        addToFavorites({
            accountId: storedAccountId,
            sessionId: storedSessionId,
            movieId: id,
            isFavourite: false
        })
    }

    return (
        <div className="w-full relative min-h-screen flex flex-col md:flex-row items-start gap-6 p-20 pr-[6rem] pl-[6rem] bg-white px-8">
            <div className="w-dvw lg:w-1/2 flex justify-center">
                <Image
                    alt="Movie Poster"
                    src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
                    className="rounded-lg shadow-md max-w-xs"
                />
            </div>
            <div className="w-full md:w-2/3 md:text-left flex flex-col gap-4 px-8">
                <h2 className="text-4xl font-bold text-gray-900 text-left">{data.title}</h2>
                <div>
                    <p className="text-gray-600 text-left font-bold">{data.genres.map(g => g.name).join(", ")}</p>
                    <Spacer y={1} />
                    <div className="flex text-sm">
                        <p className="text-gray-600 text-left font-bold">
                            {new Date(data.release_date).toLocaleDateString("en-GB")}
                        </p>
                        <p className="mr-2 ml-2 font-bold text-gray-400">•</p>
                        <p className="text-gray-600 text-left font-bold">
                            {Math.floor(data.runtime / 60)}h {data.runtime % 60}m
                        </p>
                        <p className="mr-2 ml-2 font-bold text-gray-400">•</p>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" alt="IMDb" className="w-10" />
                        <p className="mr-2 ml-2 text-gray-600 font-bold">{data.vote_average.toFixed(1)}</p>

                    </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed text-left">{data.tagline}</p>

                <div className="mt-2">
                    <p className="text-md font-bold mb-1">Overview</p>
                    <p className="text-gray-700 text-justify leading-relaxed text-left">{data.overview}</p>
                </div>
                <div className="mt-2">
                    <p className="text-md font-bold mb-1">Cast</p>
                    <div className="w-full mx-auto grid grid-cols-5 gap-4 justify-center ">
                        {castData?.cast?.slice(0, 5).map(actor => (
                            <div key={actor.id} className="flex flex-col items-center">
                                <Image
                                    alt={actor.name}
                                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                    className="rounded-lg shadow-md w-24 h-24 object-cover"
                                />
                                <p className="text-wrap whitespace-normal text-xs text-gray-700 mt-2">{actor.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="relative">
                <FavouriteButton
                    onClick={isFavouriteMovie ? onRemoveFromFavourite : onAddToFavorite}
                    fill={isFavouriteMovie ? "currentColor" : "none"}
                />
            </div>
        </div>

    )
}

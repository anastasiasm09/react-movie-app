import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Image, Spacer } from "@heroui/react";

export default function Movie() {

    const HeartIcon = ({
        size = 24,
        width,
        height,
        strokeWidth = 1.5,
        fill = "none",
        ...props
    }) => {
        return (
            <svg
                aria-hidden="true"
                fill={fill}
                focusable="false"
                height={size || height}
                role="presentation"
                viewBox="0 0 24 24"
                width={size || width}
                {...props}
            >
                <path
                    d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={strokeWidth}
                />
            </svg>
        );
    };

    const { id } = useParams();

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNjQxY2Y1NGI3ZDlhZTI2NjQ0YTQ5YWI1YzMxYmFhMyIsIm5iZiI6MTc0MjU1NjQ4OS43NTUsInN1YiI6IjY3ZGQ0ZDQ5MDQxNjg3NWFkYzY5ODNlMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4BHTpi8ZBwBsQFQ9wSZ17es4_C6OHCQMf7dTmwWHv8o'
        }
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ['movieDetails', id],
        queryFn: () =>
            fetch(`https://api.themoviedb.org/3/movie/${id}`, options)
                .then(res => res.json())
    });

    const { data: castData } = useQuery({
        queryKey: ['movieCast', id],
        queryFn: () =>
            fetch(`https://api.themoviedb.org/3/movie/${id}/credits`, options)
                .then(res => res.json()),
        enabled: !!data
    });

    if (isLoading) return <p>'Loading...'</p>;
    if (isError) return <p>`'An error has occurred: ' ${+ isError.message}`</p>;

    return (
        <div className="w-full relative min-h-screen flex flex-col md:flex-row items-start gap-6 p-10 pr-[6rem] pl-[6rem] bg-white px-8">
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
                    <p className="text-gray-700 leading-relaxed text-left">{data.overview}</p>
                </div>
                <div className="mt-2">
                    <p className="text-md font-bold mb-1">Cast</p>
                    <div className="w-full grid grid-cols-3 sm:grid-cols-3 gap-4">
                        {castData?.cast?.slice(0, 6).map(actor => (
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
                <HeartIcon className="absolute top-2 right-6 w-7 h-7 text-red-500 hover:text-red-700 cursor-pointer transition" />
            </div>
        </div>

    )
}

import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, Image } from "@heroui/react"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { div } from "framer-motion/client";

export default function MovieList() {
    const navigate = useNavigate();

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNjQxY2Y1NGI3ZDlhZTI2NjQ0YTQ5YWI1YzMxYmFhMyIsIm5iZiI6MTc0MjU1NjQ4OS43NTUsInN1YiI6IjY3ZGQ0ZDQ5MDQxNjg3NWFkYzY5ODNlMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4BHTpi8ZBwBsQFQ9wSZ17es4_C6OHCQMf7dTmwWHv8o'
        }
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ['repoData'],
        queryFn: () =>
            fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', options)
                .then(res => res.json())
    });

    const { data: popularData } = useQuery({
        queryKey: ['popularMovies'],
        queryFn: () =>
            fetch('https://api.themoviedb.org/3/movie/popular?language=en-US', options)
                .then(res => res.json())
    });

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>`An error has occurred: ${+ isError.message}`</p>

    const movies = data.results;
    const firstMovie = movies[0];
    const otherMovies = movies.slice(1, 5);
    const popularMovies = popularData?.results.slice(0, 5) || [];

    console.log('popularMovies', popularMovies)

    function handleSelectClick(id) {
        navigate(`/movies/${id}`)
    }

    return (
        <div className="flex w-full min-h-screen p-8 gap-6">
            <div className="w-4/5 flex flex-col gap-4">
                {firstMovie && (
                    <Card isPressable onPress={() => handleSelectClick(firstMovie.id)} key={firstMovie.id} className="relative h-[400px] rounded-lg overflow-hidden shadow-lg w-full">
                        <Image
                            alt={firstMovie.title}
                            className="w-full h-full object-cover"
                            src={`https://image.tmdb.org/t/p/w500${firstMovie.poster_path}`}
                        />
                        <CardHeader className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <h4 className="text-white font-bold text-2xl">{firstMovie.title}</h4>
                            <p className="text-white/70 text-sm">{firstMovie.genre_ids.join(', ')}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" alt="IMDb" className="w-10" />
                                <p className="text-white font-medium">{firstMovie.vote_average.toFixed(1)}</p>
                            </div>
                        </CardHeader>
                    </Card>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {otherMovies.map((movie) => (
                        <Card isPressable onPress={() => handleSelectClick(movie.id)} key={movie.id} className="relative h-[200px] rounded-lg overflow-hidden shadow-lg">
                            <Image
                                alt={movie.title}
                                className="w-full h-full object-cover"
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            />
                            <CardHeader className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                <h4 className="text-white font-bold text-lg">{movie.title}</h4>
                                <p className="text-white/70 flex text-xs">{movie.genre_ids.join(', ')}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" alt="IMDb" className="w-6" />
                                    <p className="text-white text-sm">{movie.vote_average.toFixed(1)}</p>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
            {/* Права панель (30%) */}
            <div className="w-1/5 p-4 bg-white rounded-lg shadow-lg">
                <h2 className="text-gray-800 text-xl font-semibold mb-6 text-left">Popular Movies</h2>
                <div className="space-y-4">
                    {popularMovies.map((movie) => (
                        <div key={movie.id} className="flex flex-row gap-4">
                            <div className="relative flex flex-col items-start " >
                                <Image
                                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                    alt={movie.title}
                                    className="max-w-20 max-h-32 object-cover rounded-md"
                                />
                            </div>
                            <div className="flex flex-col text left">
                                <h3 className="text-base">{movie.title}</h3>
                                <p className="text-gray-500 text-xs">{movie.genre_ids.join(', ')}</p>
                                <div className="flex gap-2 mt-5">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" alt="IMDb" className="w-6" />
                                    <p className="text-gray-500 text-xs">{movie.vote_average.toFixed(1)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

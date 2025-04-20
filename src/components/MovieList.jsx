import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Card, CardBody, CardFooter, CardHeader, Image } from "@heroui/react"
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

    const { data: movieData, isLoading, isError } = useQuery({
        queryKey: ['repoData'],
        queryFn: () =>
            fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', options)
                .then(res => res.json())
    });

    const { data: popularData, isLoading: isPopularLoading, isError: isPopularError } = useQuery({
        queryKey: ['popularMovies'],
        queryFn: () =>
            fetch('https://api.themoviedb.org/3/movie/popular?language=en-US', options)
                .then(res => res.json())
    });

    const { data: bannerForFirstMovie, isLoading: isFirstBannerLoading, isError: isFirstBannerError } = useQuery({
        queryKey: ['firstMovieBanner'],
        enabled: !!movieData,
        queryFn: () =>
            fetch(`https://api.themoviedb.org/3/movie/${movieData.results[0].id}/images`, options)
                .then(res => res.json())
    });

    const { data: bannerForSecondMovie, isLoading: isSecondBannerLoading, isError: isSecondBannerError } = useQuery({
        queryKey: ['secondMovieBanner'],
        enabled: !!movieData,
        queryFn: () =>
            fetch(`https://api.themoviedb.org/3/movie/${movieData.results[1].id}/images`, options)
                .then(res => res.json())
    });

    const { data: genresData, isLoading: isGenresLoading, isError: isGenresError } = useQuery({
        queryKey: ['genres'],
        queryFn: () =>
            fetch('https://api.themoviedb.org/3/genre/movie/list?language=en-US', options)
                .then(res => res.json())
    });

    if (isLoading || isPopularLoading || isFirstBannerLoading || isSecondBannerLoading || isGenresLoading) return <p>Loading...</p>;
    if (isError || isPopularError || isFirstBannerError || isSecondBannerError || isGenresError) return <p>`An error has occurred: ${+ isError.message}`</p>

    const movies = movieData.results;
    const moviesBanner = movies.slice(0, 2);
    const otherMovies = movies.slice(2, 8);
    const popularMovies = popularData?.results.slice(0, 5) || [];
    const firstBanner = bannerForFirstMovie.backdrops[0];
    const secondBanner = bannerForSecondMovie.backdrops[0];
    const bannersForTheFirstTwoMovies = [firstBanner, secondBanner];

    const genreMap = genresData?.genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
    }, {}) || {};

    function handleSelectClick(id) {
        navigate(`/movies/${id}`)
    }

    return (
        <div className="flex w-full min-h-screen p-8 gap-6">
            <div className="lg:w-4/5 flex flex-col w-full gap-4">
                <div className="flex flex-col lg:flex-row md:flex-col sm:flex-col w-full gap-5 ">
                    {moviesBanner.map((movie, index) => (
                        <Card
                            isPressable
                            onPress={() => handleSelectClick(movie.id)}
                            key={movie.id}
                            className="relative overflow-hidden shadow-lg w-full max-h-48 md:max-h-64 sm:max-h-full">
                            <Image
                                alt={movie.title}
                                className="w-full h-full object-cover"
                                src={`https://image.tmdb.org/t/p/original${bannersForTheFirstTwoMovies[index].file_path}`}
                            />
                            <CardHeader className="absolute flex flex-col bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                <h4 className="text-white font-bold text-lg md:text-xl sm:text-2xl truncate">{movie.title}</h4>
                                <p className="text-white/70 text-xs md:text-sm sm:text-base truncate">{movie.genre_ids.map(id => genreMap[id]).join(', ')}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" 
                                        alt="IMDb"
                                        className="w-6 md:w-8 lg:w-10" />
                                    <p className="text-white font-medium text-sm md:text-base sm:text-lg">{movie.vote_average.toFixed(1)}</p>
                                </div>
                            </CardHeader>
                        </Card>
                    )
                    )}
                </div>

                <div className="grid w-full mx-auto grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 justify-center">
                    {otherMovies.map((movie, index) => (
                        <Card isPressable onPress={() => handleSelectClick(movie.id)} key={movie.id} className={index >= 5 ? "block lg:hidden" : ""}>
                            <Image
                                removeWrapper
                                alt="Card background"
                                className="z-0 w-full h-full rounded-lg object-cover"
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            />
                        </Card>
                    ))}
                </div>
            </div>
            {/* popular movies */}
            <div className="w-1/5 p-4 bg-white rounded-lg shadow-lg hidden md:block">
                <h2 className="text-gray-800 text-xl font-semibold mb-6 text-left">Popular Movies</h2>
                <div className="space-y-4">
                    {popularMovies.map((movie) => (
                        <div key={movie.id} className="flex flex-row gap-4">
                            <div onClick={() => handleSelectClick(movie.id)} className="relative flex flex-col items-start cursor-pointer" >
                                <Image
                                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                    alt={movie.title}
                                    className="max-w-20 max-h-32 object-cover rounded-md"
                                />
                            </div>
                            <div className="flex flex-col text left">
                                <h3 className="font-extrabold text-sm leading-5">{movie.title}</h3>
                                <p className="text-gray-500 text-xs">{movie.genre_ids.map((id) => genreMap[id]).join(', ')}</p>
                                <div className="flex gap-2 mt-1">
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

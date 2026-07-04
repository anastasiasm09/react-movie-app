import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, Label, SearchField, Avatar, Button, Chip } from "@heroui/react"
import { useNavigate } from "react-router-dom";
import { getTrendingMoviesRequest, getPopularDataRequest, getBannerForFirstMovieRequest, getGenresDataRequest } from "../requests/movies";
import { AiFillHome } from "react-icons/ai";
import { MdFavorite } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import { MdContactSupport } from "react-icons/md";
import { Person } from "@gravity-ui/icons";
import { GrFavorite } from "react-icons/gr";
import movieLogo from '../Image/movieLogo.png'

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
        queryFn: () => getTrendingMoviesRequest()
    });

    const { data: popularData, isLoading: isPopularLoading, isError: isPopularError } = useQuery({
        queryKey: ['popularMovies'],
        queryFn: () => getPopularDataRequest()
    });

    const { data: bannerForFirstMovie, isLoading: isFirstBannerLoading, isError: isFirstBannerError } = useQuery({
        queryKey: ['firstMovieBanner'],
        enabled: !!movieData,
        queryFn: () => getBannerForFirstMovieRequest(movieData)
    });

    const { data: genresData, isLoading: isGenresLoading, isError: isGenresError } = useQuery({
        queryKey: ['genres'],
        queryFn: () => getGenresDataRequest()
    });

    if (isLoading || isPopularLoading || isFirstBannerLoading || isGenresLoading) return <p>Loading...</p>;
    if (isError || isPopularError || isFirstBannerError || isGenresError) return <p>`An error has occurred: ${+ isError.message}`</p>

    const movies = movieData.results;
    const bannerMovie = movies[0];
    const otherMovies = movies.slice(2, 8);
    const popularMovies = popularData?.results.slice(0, 5) || [];
    const firstBanner = bannerForFirstMovie.backdrops[0];

    const genreMap = genresData?.genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
    }, {}) || {};

    function handleSelectClick(id) {
        navigate(`/movies/${id}`)
    }

    return (
        <div className="flex w-full min-h-screen p-4 gap-6 bg-[#0e1518]">
            <div className="w-1/5 p-2 bg-[#0e1518] rounded-lg hidden md:block">
                <h1
                    className="text-2xl text-red-900 font-black lg:w-4/5 flex flex-col py-4 px-2 gap-5">
                    <a href="/">
                        <img src={movieLogo.src} 
                        alt="Movie logo" 
                        width={80}
                        />
                    </a>
                </h1>
                <div className="mt-8 space-y-1">
                    <div className="flex items-center py-3 px-2 gap-5 text-[#f9f8ff]">
                        <AiFillHome className="text-[#959ca3]" />
                        <span className="font-medium text-base text-[#959ca3] cursor-pointer">Home</span>
                    </div>
                    <div className="flex items-center py-3 px-2 gap-5 text-[#f9f8ff]">
                        <MdFavorite className="text-[#959ca3]" />
                        <span className="font-medium text-base text-[#959ca3] cursor-pointer">Favorites</span>
                    </div>
                    <div className="flex items-center py-3 px-2 gap-5 text-[#f9f8ff]">
                        <FaArrowTrendUp className="text-[#959ca3]" />
                        <span className="font-medium text-base text-[#959ca3] cursor-pointer">Popular</span>
                    </div>
                    <div className="flex items-center py-3 px-2 gap-5 text-[#f9f8ff]">
                        <IoSettings className="text-[#959ca3]" />
                        <span className="font-medium text-base text-[#959ca3] cursor-pointer"> Settings</span>
                    </div>
                    <div className="flex items-center py-3 px-2 gap-5 text-[#f9f8ff]">
                        <MdContactSupport className="text-[#959ca3]" />
                        <span className="font-medium text-base text-[#959ca3] cursor-pointer">About</span>
                    </div>
                </div>
            </div>
            <div className="lg:w-4/5 flex flex-col w-full gap-6 pe-4">
                {/* Search & Avatar Bar */}
                <div className='flex gap-6 items-end'>
                    {/* Search */}
                    <div className='flex-grow '>
                        <SearchField name="search" variant='secondary'>
                            <Label>Search</Label>
                            <SearchField.Group className="bg-[#959ca3]/30 rounded-lg">
                                <SearchField.SearchIcon />
                                <SearchField.Input className="text-white/70" placeholder="Search..." />
                                <SearchField.ClearButton />
                            </SearchField.Group>
                        </SearchField>
                    </div>
                    {/* Avatar */}
                    <div className='flex-shrink-0'>
                        <Avatar className="bg-[#959ca3]/30 rounded-lg size-9">
                            <Avatar.Fallback className="bg-[#959ca3]/30">
                                <Person className="text-white/70" />
                            </Avatar.Fallback>
                        </Avatar>
                    </div>
                </div>
                {/* moviesBanner */}
                <div className="w-full">
                    <Card
                        role="link"
                        tabIndex={0}
                        onClick={() => handleSelectClick(bannerMovie.id)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                handleSelectClick(bannerMovie.id);
                            }
                        }}
                        className="overflow-hidden cursor-pointer shadow-lg w-full h-80 sm:h-96 lg:h-[28rem] hover:scale-[1.02] transition-transform duration-200"
                    >
                        <img
                            alt={bannerMovie.title}
                            aria-hidden="true"
                            className="absolute inset-0 h-full w-full object-cover"
                            src={`https://image.tmdb.org/t/p/original${firstBanner.file_path}`}
                        />
                        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 ">
                            {bannerMovie.genre_ids.map(id => (
                                <Chip
                                    key={id}
                                    variant="flat"
                                    radius="full"
                                    className="bg-white/20 text-white backdrop-blur-md border border-white/10 text-xs sm:text-sm font-medium h-auto py-1 px-3"
                                >
                                    {genreMap[id]}
                                </Chip>

                            ))}
                        </div>
                        <CardHeader
                            className="absolute bottom-0 left-0 right-0 flex flex-row 
                            bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 sm:p-6 items-end justify-between">
                            <div className='flex flex-col flex-grow max-w-[calc(100%-3rem)]'>
                                <h4 className="truncate text-lg font-bold text-white md:text-2xl">
                                    {bannerMovie.title}
                                </h4>
                                <div className="mt-1 flex items-center gap-2">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
                                        alt="IMDb"
                                        className="w-6 md:w-8 lg:w-10"
                                    />
                                    <p className="text-sm font-medium text-white md:text-base">
                                        {bannerMovie.vote_average.toFixed(1)}
                                    </p>
                                </div>
                            </div>
                            {/* Favorite */}
                            <div className="flex-shrink-0 mb-1">
                                <Button
                                    className="bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md min-w-10 w-10 h-10 p-0">
                                    <GrFavorite />
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
                <div className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                    {otherMovies.map((movie, index) => (
                        <div
                            key={movie.id}
                            className={`flex flex-col gap-2 ${index >= 5 ? "block lg:hidden" : ""}`}
                        >
                            <div
                                onClick={() => handleSelectClick(movie.id)}
                                className="relative overflow-hidden shadow-lg w-full aspect-[2/3] 
                                rounded-3xl cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                            >
                                <img
                                    alt={bannerMovie.title}
                                    className="h-full w-full object-cover"
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                />
                            </div>
                            <h4 className="truncate text-lg font-bold text-white md:text-2xl">
                                {otherMovies.title}
                            </h4>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

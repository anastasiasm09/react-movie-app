'use client'

import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, Label, SearchField, Avatar, Button, Chip, ScrollShadow } from "@heroui/react"
import { getTrendingMoviesRequest, getPopularDataRequest, getBannerForFirstMovieRequest } from "../requests/movies";
import { AiFillHome } from "react-icons/ai";
import { MdFavorite } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import { MdContactSupport } from "react-icons/md";
import { Person } from "@gravity-ui/icons";
import { GrFavorite } from "react-icons/gr";
import { FaStar } from "react-icons/fa";
import movieLogo from '../Image/movieLogo.png'
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useGenres } from '../hooks/useGenres';

export default function Home() {
    const router = useRouter();

    const { data: movieData, isLoading, isError } = useQuery({
        queryKey: ['repoData'],
        queryFn: () => getTrendingMoviesRequest()
    });

    const { isLoading: isPopularLoading, isError: isPopularError } = useQuery({
        queryKey: ['popularMovies'],
        queryFn: () => getPopularDataRequest()
    });

    const { data: bannerForFirstMovie, isLoading: isFirstBannerLoading, isError: isFirstBannerError } = useQuery({
        queryKey: ['firstMovieBanner'],
        enabled: !!movieData,
        queryFn: () => getBannerForFirstMovieRequest(movieData)
    });
    
    const { genreMap, isGenresLoading, isGenresError } = useGenres();

    if (isLoading || isPopularLoading || isFirstBannerLoading || isGenresLoading) return <p>Loading...</p>;
    if (isError || isPopularError || isFirstBannerError || isGenresError) {
        return <p>Unable to load movies. Check the TMDb API token and try again.</p>;
    }

    const movies = movieData?.results || [];
    if (!movies.length) return <p>No movies found.</p>;

    const bannerMovie = movies[0];
    const top10Movies = movies.slice(1, 11);
    const firstBanner = bannerForFirstMovie?.backdrops?.[0];
    const bannerImagePath = firstBanner?.file_path || bannerMovie.backdrop_path || bannerMovie.poster_path;
    const bannerImageSrc = bannerImagePath ? `https://image.tmdb.org/t/p/original${bannerImagePath}` : '/vite.svg';

    function handleSelectClick(id) {
        router.push(`/movie?id=${id}`)
    }

    return (
        <div className="flex w-full min-h-screen bg-[#0e1518] px-6 md:px-8 py-6 gap-8 lg:gap-12">
            <aside className="hidden md:block w-44 flex-shrink-0">
                <h1 className="flex flex-col py-4 px-2">
                    <img src={movieLogo.src}
                        alt="Movie logo"
                        width={80}
                    />
                </h1>
                <nav className="mt-8">
                    <ul className="space-y-1">
                        <li>
                            <Link href="/" className="flex items-center py-3 px-2 gap-5 text-[#f9f8ff]">
                                <AiFillHome className="text-[#959ca3]" />
                                <span className="font-medium text-base text-[#959ca3] cursor-pointer">Home</span>
                            </Link>
                        </li>
                        <li>
                            <button className="flex items-center py-3 px-2 gap-5 text-[#f9f8ff]">
                                <MdFavorite className="text-[#959ca3]" />
                                <span className="font-medium text-base text-[#959ca3] cursor-pointer">Favorites</span>
                            </button>
                        </li>
                        <li>
                            <Link href="/popular" className="flex items-center py-3 px-2 gap-5 text-[#f9f8ff]">
                                <FaArrowTrendUp className="text-[#959ca3]" />
                                <span className="font-medium text-base text-[#959ca3]">Popular</span>
                            </Link>
                        </li>
                        <li>
                            <button className="flex items-center py-3 px-2 gap-5 text-[#f9f8ff]">
                                <IoSettings className="text-[#959ca3]" />
                                <span className="font-medium text-base text-[#959ca3] cursor-pointer"> Settings</span>
                            </button>
                        </li>
                        <li>
                            <button className="flex items-center py-3 px-2 gap-5 text-[#f9f8ff]">
                                <MdContactSupport className="text-[#959ca3]" />
                                <span className="font-medium text-base text-[#959ca3] cursor-pointer">About</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>
            <div className="flex flex-1 min-w-0 flex-col gap-8">
                {/* Search & Avatar Bar */}
                <div className='flex gap-6 items-end'>
                    {/* Search */}
                    <div className='flex-grow'>
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
                            src={bannerImageSrc}
                        />
                        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 ">
                            {(bannerMovie.genre_ids || []).map(id => (
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
                                <div className="mt-2 flex items-center gap-2">
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
                {/* Movies */}
                <div className="w-full max-w-5xl min-w-0">
                    <h2 className='truncate text-yellow-500 py-5 text-lg font-bold md:text-2xl'>Top 10 Today</h2>
                    <ScrollShadow orientation="horizontal" className="w-full overflow-x-auto scrollbar-thumb-gray-600">
                        <div className="flex flex-nowrap gap-5 pb-4">
                            {top10Movies.map((movie) => (
                                <div
                                    key={movie.id}
                                    className="flex w-[100px] md:w-[120px] lg:w-[160px] shrink-0 flex-col gap-1.5"
                                >
                                    <div
                                        onClick={() => handleSelectClick(movie.id)}
                                        className="relative overflow-hidden shadow-lg w-full aspect-[2/3] 
                                        rounded-3xl cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                                    >
                                        <img
                                            alt={movie.title}
                                            className="h-full w-full object-cover"
                                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/vite.svg'}
                                        />
                                    </div>
                                    <h4 className="truncate text-md font-semibold text-white md:text-lg pt-2">
                                        {movie.title}
                                    </h4>
                                    <p className="truncate text-xs text-gray-300">
                                        {(movie.genre_ids || []).map(id => genreMap[id]).filter(Boolean).join(", ")}
                                    </p>
                                    <div className="flex items-center gap-2 text-yellow-500">
                                        <FaStar />
                                        <p className="text-sm font-medium text-white md:text-sm">
                                            {movie.vote_average.toFixed(1)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollShadow>
                </div>
            </div>
        </div>
    );
}

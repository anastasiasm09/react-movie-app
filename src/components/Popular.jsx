'use client'

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getPopularDataRequest, getGenresDataRequest } from "../requests/movies";
import { useRouter } from 'next/navigation';
import movieLogo from '../Image/movieLogo.png'
import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { MdFavorite } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import { MdContactSupport } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { Chip, ScrollShadow } from "@heroui/react"

export default function Popular() {
    const router = useRouter();
    const { data: popularData, isLoading: isPopularLoading, isError: isPopularError } = useQuery({
        queryKey: ['popularMovies'],
        queryFn: () => getPopularDataRequest()
    });
    const popularMovies = popularData?.results;

    const { data: genresData } = useQuery({
        queryKey: ['genres'],
        queryFn: () => getGenresDataRequest()
    });

    const genreMap = genresData?.genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
    }, {}) || {};

    function handleSelectClick(id) {
        router.push(`/movie?id=${id}`)
    }

    if (isPopularLoading) {
        return <p>Loading...</p>
    }

    if (isPopularError) {
        return <p>Something went wrong.</p>
    }

    return (
        <div className="flex w-full min-h-screen bg-[#0e1518] px-6 md:px-8 py-6 gap-8 lg:gap-12">
            {/* Sidebar */}
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
            {/*  Popular Movies */}
            <main className="w-full relative min-h-screen flex flex-col md:flex-row items-start gap-5 lg:gap-6 mt-5 bg-[#0e1518] md:w-4/5 md:pe-4">
                <section className="w-full max-w-5xl min-w-0">
                    <div className="flex flex-col gap-4 md:gap-5">
                        <h2 className='truncate text-yellow-500 text-lg font-bold md:text-2xl'>Popular Movies</h2>
                        <ScrollShadow orientation="horizontal" className="w-full overflow-x-auto scrollbar-thumb-gray-600">
                            <div className="flex w-max flex-nowrap gap-2 pb-4">
                                {Object.values(genreMap).map((genre) => (
                                    <Chip
                                        key={genre}
                                        variant="flat"
                                        radius="full"
                                        className="bg-white/20 text-white backdrop-blur-md border border-white/10 text-xs sm:text-sm font-medium h-auto py-1 px-3"
                                    >
                                        {genre}
                                    </Chip>
                                ))}
                            </div>
                        </ScrollShadow>
                        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {popularMovies.map((movie) => (
                                <div
                                    key={movie.id}
                                    className="flex min-w-0 flex-col gap-2"
                                >
                                    <div
                                        onClick={() => handleSelectClick(movie.id)}
                                        className="relative overflow-hidden shadow-lg w-full aspect-[2/3] 
                                        rounded-3xl cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                                    >
                                        <img
                                            alt={movie.title}
                                            className="h-full w-full object-cover"
                                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        />
                                    </div>
                                    <h4 className="truncate text-md font-semibold text-white md:text-lg pt-1">
                                        {movie.title}
                                    </h4>
                                    <p className="truncate text-xs text-gray-300">
                                        {movie.genre_ids.map(id => genreMap[id]).join(", ")}
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
                    </div>
                </section>
            </main>
        </div>
    )
}

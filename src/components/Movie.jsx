'use client'

import React from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { addToFavoritesRequest, getListOfFavorites } from "../requests/favourites"
import { getMovieCreditsRequest, getMovieDetailsRequest } from "../requests/movies";
import { getAccountId, getRequestToken, getSessionId } from "../requests/account";
import FavouriteButton from "./FavouriteButton";
import { Button, Chip } from "@heroui/react";
import movieLogo from '../Image/movieLogo.png'
import { MdFavorite } from "react-icons/md";
import { GrFavorite } from "react-icons/gr";
import { AiFillHome } from "react-icons/ai";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import { MdContactSupport } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import Link from "next/link";

export default function Movie() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const storedAccountId = typeof window !== 'undefined' ? localStorage.getItem('accountId') : null;
    const storedSessionId = typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null;
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

        if (isApproved === 'true' && tokenFromUrl?.length) {
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
    }, [addToFavorites, id, searchParams])

    const { data, isLoading, isError } = useQuery({
        queryKey: ['movieDetails', id],
        queryFn: () => getMovieDetailsRequest(id),
        enabled: !!id
    });

    const { data: castData } = useQuery({
        queryKey: ['movieCast', id],
        queryFn: () => getMovieCreditsRequest(id),
        enabled: !!data && !!id
    });

    const { data: favouriteMovieIds } = useQuery({
        queryKey: ['allFavourites'],
        queryFn: () => getListOfFavorites(storedAccountId),
        enabled: !!storedAccountId,
        staleTime: 30 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
    });

    if (!id) return <p>Missing movie id.</p>;
    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>An error has occurred: {isError.message}</p>;

    const isFavouriteMovie = favouriteMovieIds?.includes(data.id);

    async function onAddToFavorite() {
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
            {/*  Movie */}
            <main className="w-full relative min-h-screen flex flex-col md:flex-row items-start gap-5 lg:gap-6 mt-8 bg-[#0e1518] md:w-4/5 md:pe-4">
                <div className="w-full md:w-[380px] md:flex-none flex flex-col items-center md:items-start gap-5">
                    <div className="relative w-full max-w-[380px] mx-auto md:mx-0">
                        <img
                            alt="Movie Poster"
                            src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
                            className="block w-full rounded-2xl object-cover shadow-md"
                        />
                    </div>
                </div>
                <div className="w-full min-w-0 flex-1 md:text-left flex flex-col sm:px-2 md:px-0 lg:pl-2 gap-6">
                    <section className="flex items-start justify-between">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white text-left">{data.title}</h1>
                        <Button onClick={isFavouriteMovie ? onRemoveFromFavourite : onAddToFavorite} fill={isFavouriteMovie ? "currentColor" : "none"} className="bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md min-w-10 w-10 h-10 p-0">
                            <GrFavorite />
                        </Button>
                    </section>
                    <section className="flex flex-col gap-6">
                        <div className="z-10 flex flex-wrap gap-2">
                            {data.genres.map((genre) => (
                                <Chip
                                    key={genre.id}
                                    variant="flat"
                                    radius="full"
                                    className="bg-white/20 text-white backdrop-blur-md border border-white/10 text-xs sm:text-sm font-medium h-auto py-1 px-3"
                                >
                                    {genre.name}
                                </Chip>
                            ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
                            <p className="text-gray-200 text-left font-normal">
                                {new Date(data.release_date).toLocaleDateString("en-GB")}
                            </p>
                            <span className="font-bold text-gray-400">•</span>
                            <p className="text-gray-200 text-left font-normal">
                                {Math.floor(data.runtime / 60)}h {data.runtime % 60}m
                            </p>
                            <span className="font-bold text-gray-400">•</span>
                            <div className="flex items-center gap-2 text-yellow-500">
                                <FaStar />
                                <p className="text-sm font-normal text-yellow-500 md:text-sm">
                                    {data.vote_average.toFixed(1)}
                                </p>
                            </div>
                        </div>
                    </section>
                    <p className="text-gray-400 italic leading-relaxed text-left">{data.tagline}</p>
                    <section className="flex flex-col gap-2">
                        <h2 className="text-gray-200 text-base font-semibold">Overview</h2>
                        <p className="text-gray-300 font-light text-left leading-7 max-w-3xl">{data.overview}</p>
                    </section>
                    <section className="flex flex-col gap-3">
                        <h2 className="text-gray-200 text-base font-semibold">Cast</h2>
                        <div className="grid grid-cols-3 gap-6 sm:grid-cols-5">
                            {castData?.cast?.slice(0, 5).map(actor => (
                                <div key={actor.id} className="flex min-w-0 flex-col items-center text-center">
                                    <div className="h-20 w-20 overflow-hidden rounded-full bg-white/5">
                                        <img
                                            alt={actor.name}
                                            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <p className="mt-2 w-full truncate text-xs text-gray-300">{actor.name}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}

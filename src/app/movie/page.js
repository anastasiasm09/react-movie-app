'use client'

import React from "react";
import { Suspense } from 'react';
import Movie from "../../components/Movie";

export default function MoviePage() {
    return (
        <Suspense fallback={<>Loading movie...</>}>
            <Movie />
        </Suspense>
    )
}

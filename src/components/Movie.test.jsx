import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Movie from './Movie';
import '@testing-library/jest-dom';
import * as movieRequest from '../requests/movies';
import { TestProvidersWrapper } from '../test-utils';

jest.mock('../requests/utils', () => ({
    getToken: () => 'fake-test-token',
    requestOptions: {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer fake-test-token`,
        },
    },
}));

jest.mock('../requests/movies', () => ({
    getMovieDetailsRequest: jest.fn(),
    getMovieCreditsRequest: jest.fn(),
}));

describe('The Movie component', () => {
    test('renders movie details correctly', async () => {
        movieRequest.getMovieDetailsRequest.mockResolvedValue({
            title: 'Ash',
            genres: ['Science', 'Fiction', 'Horror', 'Thriller'],
            release_date: "2025-03-20",
            runtime: 95,
            vote_average: 5.9,
            tagline: "A new mindbender by Flying Lotus.",
            overview: "A woman wakes up on a distant planet and finds the crew of her space station viciously killed.",
        });

        movieRequest.getMovieCreditsRequest.mockResolvedValue({
            cast: [
                { id: 1222992, name: "Eiza González" },
                { id: 113732, name: "Iko Uwais" },
                { id: 167025, name: "Kate Elliott" },
            ]
        });

        render(<Movie />, { wrapper: TestProvidersWrapper });

        await waitFor(() => {
            expect(screen.getByText('Ash')).toBeInTheDocument();
            expect(screen.getByText('A new mindbender by Flying Lotus.')).toBeInTheDocument();
            expect(screen.getByText('Eiza González')).toBeInTheDocument();
            expect(screen.getByText('Iko Uwais')).toBeInTheDocument();
            expect(screen.getByText('Kate Elliott')).toBeInTheDocument();
        });
    });
});
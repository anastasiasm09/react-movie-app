import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MovieList from './MovieList';
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
    getTrendingMoviesRequest: jest.fn(),
    getBannerForFirstMovieRequest: jest.fn(),
    getBannerForSecondMovieRequest: jest.fn(),
    getGenresDataRequest: jest.fn(),
    getPopularDataRequest: jest.fn(),
}));

describe('The MovieList component', () => {
    beforeEach(() => {
        movieRequest.getTrendingMoviesRequest.mockResolvedValue({
            results: [
                {
                    id: 1,
                    title: 'Ash',
                    genre_ids: [1, 2, 3, 4],
                    vote_average: 5.9,
                },
                {
                    id: 2,
                    title: 'Other Movie',
                    genre_ids: [1, 2],
                    vote_average: 7.1,
                },
            ],
        });

        movieRequest.getPopularDataRequest.mockResolvedValue({
            results: [],
        });

        movieRequest.getGenresDataRequest.mockResolvedValue({
            genres: [
                { id: 1, name: 'Science' },
                { id: 2, name: 'Fiction' },
                { id: 3, name: 'Horror' },
                { id: 4, name: 'Thriller' },
            ],
        });

        movieRequest.getBannerForFirstMovieRequest.mockResolvedValue({
            backdrops: [{ file_path: '/first-movie-banner.jpg' }],
        });

        movieRequest.getBannerForSecondMovieRequest.mockResolvedValue({
            backdrops: [{ file_path: '/second-movie-banner.jpg' }],
        });
    });

    test('renders first two banner movies', async () => {
        render(<MovieList />, { wrapper: TestProvidersWrapper });

        await waitFor(() => {
            expect(screen.getByText('Ash')).toBeInTheDocument();
            expect(screen.getByText('Science, Fiction, Horror, Thriller')).toBeInTheDocument();
            expect(screen.getByText('5.9')).toBeInTheDocument();
        });
    });

    test('renders banner image', async () => {
        render(<MovieList />, { wrapper: TestProvidersWrapper });

        const bannerImage = await screen.findByAltText('Ash');
        expect(bannerImage).toHaveAttribute('src', expect.stringContaining('https://image.tmdb.org'));
    });
});

describe('Popular movies', () => {
    test('renders popular movies with titles, genres and vote averanges', async () => {
        movieRequest.getPopularDataRequest.mockResolvedValue({
            results: [
                {
                    title: 'A Working Man',
                    genre_ids: [28, 80, 53],
                    vote_average: 6.3,
                },
                {
                    title: 'Havoc',
                    genre_ids: [28, 80, 53],
                    vote_average: 6.7,
                },
                {
                    title: 'A Minecraft Movie',
                    genre_ids: [10751, 35, 12, 14],
                    vote_average: 6.2,
                }
            ]
        })

        movieRequest.getGenresDataRequest.mockResolvedValue({
            genres: [
                { id: 28, name: 'Action' },
                { id: 80, name: 'Crime' },
                { id: 53, name: 'Thriller' },
                { id: 10751, name: 'Family' },
                { id: 35, name: 'Comedy' },
                { id: 12, name: 'Adventure' },
                { id: 14, name: 'Fantasy' },
            ]
        })

        render (<MovieList />, { wrapper: TestProvidersWrapper });

        await waitFor(() => {
            expect(screen.getByText('A Working Man')).toBeInTheDocument();
            expect(screen.getByText('Havoc')).toBeInTheDocument();
            expect(screen.getByText('A Minecraft Movie')).toBeInTheDocument();

            expect(screen.getAllByText('Action, Crime, Thriller')).toHaveLength(2);
            expect(screen.getByText('Family, Comedy, Adventure, Fantasy')).toBeInTheDocument();

            expect(screen.getByText('6.3')).toBeInTheDocument();
            expect(screen.getByText('6.7')).toBeInTheDocument();
            expect(screen.getByText('6.2')).toBeInTheDocument();
        })
    })
})
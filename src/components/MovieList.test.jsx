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

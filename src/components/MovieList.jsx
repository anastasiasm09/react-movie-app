import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardFooter, Image, Button } from "@heroui/react"

export default function MovieList() {

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

    if (isLoading) return <p>'Loading...'</p>;
    if (isError) return <p>`'An error has occurred: ' ${+ isError.message}`</p>

    const movies = data.results;
    //const movies = data?.results || []; ?????

    console.log(movies)

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8">
            {movies.map((movie) => (
                <Card key={movie.id} className="relative h-[300px] rounded-lg overflow-hidden shadow-lg">
                    <Image
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    />
                    <CardHeader className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 flex-col">
                        <h4 className="text-white font-bold text-xl">{movie.title}</h4>
                        <p className="text-white/70 text-sm">{movie.genre_ids.join(', ')}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" alt="IMDb" className="w-10" />
                            <p className="text-white font-medium">{movie.vote_average.toFixed(1)}</p>
                        </div>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
}

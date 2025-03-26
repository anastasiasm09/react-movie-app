import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export default function Movie() {

    const { id } = useParams();

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
            fetch(`https://api.themoviedb.org/3/movie/${id}`, options)
                .then(res => res.json())
    });

    if (isLoading) return <p>'Loading...'</p>;
    if (isError) return <p>`'An error has occurred: ' ${+ isError.message}`</p>

    //console.log(id)
    //console.log(data)

    return (
        <section>
            <h1>Movie</h1>
        </section>
    )
}

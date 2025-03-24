import {HeroUIProvider} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import MovieList from "./components/MovieList";

function App() {
  const title = "MOVIES";


/*   const options = {
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

  console.log(data) */


  return (
    <HeroUIProvider>
      <main>
        <h1>{title}</h1>
        <MovieList />
      </main>
    </HeroUIProvider>
  )
}

export default App

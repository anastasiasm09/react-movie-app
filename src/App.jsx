import { HeroUIProvider } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Link, Routes, Route } from "react-router-dom";
import MovieList from "./components/MovieList";
import Movie from "./components/Movie";

function App() {
  const title = "MOVIES";

  return (
    <HeroUIProvider>
      <h1>{title}</h1>
      <main>
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movies/:id" element={<Movie />} />
        </Routes>
      </main>
    </HeroUIProvider>
  )
}

export default App

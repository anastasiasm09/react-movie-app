import { HeroUIProvider } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Link, Routes, Route } from "react-router-dom";
import MovieList from "./components/MovieList";
import Movie from "./components/Movie";
import Footer from "./components/Footer";
function App() {
  const title = "RM.app";

  return (
    <HeroUIProvider>
      <h1>{title}</h1>
      <main>
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movies/:id" element={<Movie />} />
        </Routes>
        <Footer />
      </main>
    </HeroUIProvider>
  )
}

export default App

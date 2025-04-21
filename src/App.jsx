import { HeroUIProvider } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Link, Routes, Route } from "react-router-dom";
import MovieList from "./components/MovieList";
import Movie from "./components/Movie";
import Footer from "./components/Footer";

function App() {
  const logo = "RM.app";

  return (
    <HeroUIProvider>
      <header className="flex justify-between items-center px-8 py-4">
      <h1 className="text-2xl font-stretch-condensed text-red-900 font-black lg:w-4/5 flex flex-col">
        {logo}
      </h1>
      </header>
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

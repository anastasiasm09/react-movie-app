import { HeroUIProvider, NavbarItem } from "@heroui/react";
import { Routes, Route } from "react-router-dom";
import MovieList from "./components/MovieList";
import Movie from "./components/Movie";
import Footer from "./components/Footer";

function App() {
  const logo = "RM.app";

  return (
    <HeroUIProvider>
      <header className="flex justify-between items-center px-8 py-4">
        <h1 
        className="text-2xl font-stretch-condensed text-red-900 font-black lg:w-4/5 flex flex-col">
        <a href="/">
        {logo}
        </a>
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

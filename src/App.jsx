import React from "react";
import { HeroUIProvider, NavbarItem } from "@heroui/react";
import { Routes, Route } from "react-router-dom";
import MovieList from "./components/MovieList";
import Movie from "./components/Movie";
import Footer from "./components/Footer";

function App() {

  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movies/:id" element={<Movie />} />
        </Routes>
        <Footer />
      </main>
    </>
  )
}

export default App

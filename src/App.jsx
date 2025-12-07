import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount } from "./appwrite";
const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovie, setTrendingMovie] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);
  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoints = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoints, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed fetching movies");
      }
      const data = await response.json();

      if (data.response === false) {
        setErrorMessage(data.Error || "Failed to fetch moviess");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
     if(query && data.results.length > 0) {
      await  updateSearchCount(query, data.results[0]);
     }
    } catch (error) {
      console.error(`Failed to fetch movies:", ${error}`);
      setErrorMessage("Error fetching movies. Please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  return (
    <>
      <main>
        <div className="pattern" />
        <div className="wrapper">
          <h2 className="logo text-gradient"><a href="../index.html">ZerFlix movie</a></h2>
          <header>
            <img src="../public/images/hero.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          <section className="all-movies">
            <h2 className="mt-[40px]">All Movies</h2>

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>

        <footer className="text-gradient text-center mt-5 wrapper text-3xl">  
          <p className="sponser pb-2">sponsered by ZerFlix</p>
          <p>&copy; copyright All right are reserved 2025. Yeabsira Getachew</p>
        </footer>
      </main>
    </>
  );
};

export default App;

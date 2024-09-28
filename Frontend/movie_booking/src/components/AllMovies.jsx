import { useEffect, useState } from "react";
import axios from "axios";
import EachMovie from "./EachMovie";

function AllMovies({ city }) {
  const [movies, setMovies] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const fetchMovies = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/movies/${city}`,
        {
          params: {
            language: selectedLanguage,
            genre: selectedGenre,
          },
        }
      );
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [city, selectedLanguage, selectedGenre]);

  const handleLanguageClick = (language) => {
    if (selectedLanguage === language) {
      setSelectedLanguage("");
    } else {
      setSelectedLanguage(language);
    }
  };

  const handleGenreClick = (genre) => {
    if (selectedGenre === genre) {
      setSelectedGenre("");
    } else {
      setSelectedGenre(genre);
    }
  };

  const supportedLanguages = ["Telugu", "Kannada", "Hindi", "English"];
  const supportedGenres = [
    "Action",
    "Drama",
    "Romance",
    "Sci-Fi",
    "Crime",
    "Thriller",
    "Adventure",
    "Fantasy",
  ];
  return (
    <div>
      <div className="language">
        <h4>Languages:</h4>
        {supportedLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => handleLanguageClick(lang)}
            style={{
              backgroundColor: selectedLanguage === lang ? "blue" : "white",
              color: selectedLanguage === lang ? "white" : "black",
            }}
          >
            {lang}
          </button>
        ))}
      </div>
      <div className="genre">
        <h4>Genre:</h4>
        {supportedGenres.map((gen) => (
          <button
            key={gen}
            onClick={() => handleGenreClick(gen)}
            style={{
              backgroundColor: selectedGenre === gen ? "green" : "white",
              color: selectedGenre === gen ? "white" : "black",
            }}
          >
            {gen}
          </button>
        ))}
      </div>
      <div
        style={{ padding: "75px 50px 25px 50px", margin: "0px" }}
        className="row"
      >
        {movies.length > 0 ? (
          movies.map((movie) => <EachMovie data={movie} key={movie.id} />)
        ) : (
          <p>No movies available</p> // Fallback message if no movies are found
        )}
      </div>
    </div>
  );
}
export default AllMovies;

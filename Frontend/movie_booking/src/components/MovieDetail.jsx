import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState({});
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/movie-detail/" + id)
      .then((response) => setMovie(response.data))
      .catch((error) => console.log(error));
  }, [id]);
  let navigate = useNavigate();
  function handleClick(e) {
    e.preventDefault();
    navigate("/movieScreeningsPage/" + id);
  }

  return (
    <div className="movie-detail-background">
      <div className="movie-detail">
        <div className="poster-trailer">
          <img src={movie.poster_url} width={279} height={402} />

          <iframe
            width="715"
            height="402"
            src={movie.trailer_url}
            frameborder="5"
          ></iframe>
        </div>
        <div className="without-img">
          <h2 className="movie">{movie.title}</h2>
          <p className="description">{movie.description}</p>
          <h5 className="director">Director: {movie.director}</h5>
          <h5 className="actors">Actors: {movie.actors}</h5>
          <h5 className="languages">Languages: {movie.languages}</h5>
          <h5 className="genre2">genre: {movie.genre}</h5>
          <h5 className="rating">rating: {movie.rating}/10</h5>
          <h5 className="duration">duration: {movie.running_time} min</h5>
        </div>
        <div className="book-tickets-div">
          <button onClick={handleClick}>Book Tickets</button>
        </div>
      </div>
    </div>
  );
}
export default MovieDetail;

import { useEffect, useState } from "react";
import axios from "axios";
import EachMovie from "./EachMovie"

function AllMovies({ city }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/movies/" + city)
      .then((Response) => setMovies(Response.data))
      .catch((error) => console.log(error));
  }, [city]); // Add city as a dependency

  return (
    <div
      style={{ padding: "75px 50px 25px 50px", margin: "0px" }}
      className="row"

    >
      {movies.map((movie) => (
        <EachMovie data={movie} key={movie.id} />
      ))}
    </div>
  );
}
export default AllMovies;

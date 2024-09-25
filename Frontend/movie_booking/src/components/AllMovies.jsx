import EachMovie from "./EachMovie";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

function AllMovies() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/movies/Bangalore/")
      .then((Response) => setMovies(Response.data))
      .catch((error) => console.log(error));
  }, []);
  return (
    <div style={{ padding: "75px 50px 25px 50px", margin:"0px"}} className="row">
      {movies.map((movie) => (
          <EachMovie
            data={movie}
            key={movie.id}
          />
        ))}
    </div>
  );
}
export default AllMovies;

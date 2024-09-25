import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EachScreening from "./EachScreening";
import { FaLessThan } from "react-icons/fa6";
import { FaGreaterThan } from "react-icons/fa6";

function AllScreenings() {
  const { id } = useParams();
  const [screenings, setScreenings] = useState([]);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/movie-screenings/" + id)
      .then((Response) => setScreenings(Response.data))
      .catch((error) => console.log(error));
  }, []);
  return (
    <div className="all-screenings-background">
      <div className="screenings-border">
      <div className="dates">
        <FaLessThan className="than" size={27}/>
        <button>23 Oct</button>
        <button>24 Oct</button>
        <button>25 Oct</button>
        <FaGreaterThan className="than" size={27}/>
      </div>
      <div className="column">
        {screenings.map((screening) => (
          <EachScreening data={screening} key={screening.id} />
        ))}
      </div>
      </div>
    </div>
  );
}
export default AllScreenings;

import { useNavigate,useParams } from "react-router-dom";
import { CiStar } from "react-icons/ci";


function EachMovie(props) {
  const { city } = useParams()
  let navigate = useNavigate();
  const { poster_url, rating, title, id, genre, running_time } = props.data;
  function handleClick(e) {
    e.preventDefault();
    navigate("/"+city+"/movie/" + id);
  }
  return (
    <div class="five-items">
      <div className="card-replace">
        <img src={poster_url} width={250} height={360} onClick={handleClick} />
        <div className="black">
          <div className="rating-div">
            <CiStar />
            <span>{rating}</span>
          </div>

          <span>{running_time} min</span>
        </div>
        <div>
          <h5 className="title">{title}</h5>
          <h6 className="genre1">{genre}</h6>
        </div>
      </div>
    </div>
  );
}
export default EachMovie;

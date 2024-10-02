import { useNavigate, useParams } from "react-router-dom";
import { CiStar } from "react-icons/ci";

function EachScreening(props) {
  const { city } = useParams();
  let navigate = useNavigate();
  const { theatre_name, address, screenings } = props.data;

  function extractTime(dateTimeString) {
    const date = new Date(dateTimeString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedMinutes = String(minutes).padStart(2, "0");
    return `${hours}:${formattedMinutes}${amPm}`;
  }

  function handleClick(e, id) {
    e.preventDefault();
    navigate("/" + city + "/screening_seats/" + id);
  }

  function isPastScreening(screening) {
    const currentDateTime = new Date();
    return new Date(screening.date_time) < currentDateTime;
  }

  function getScreeningClassName(screening) {
    return isPastScreening(screening) ? "time past" : "time";
  }

  return (
    <div className="each-screen">
      <div className="left-theater-details">
        <div className="theatre-star">
          <CiStar size={25} />
          <h5 className="theatre-name">{theatre_name}</h5>
        </div>
        <div>
          <p className="area">{address}</p>
        </div>
      </div>
      <div className="times">
        {screenings.map((obj) => (
          <button
            className={getScreeningClassName(obj)}
            onClick={(e) => handleClick(e, obj.id)}
            key={obj.id}
            disabled={isPastScreening(obj)}
          >
            {extractTime(obj.date_time)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EachScreening;

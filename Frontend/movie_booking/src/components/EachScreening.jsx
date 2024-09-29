import { useNavigate, useParams } from "react-router-dom";
import { CiStar } from "react-icons/ci";

function EachScreening(props) {
  const { city } = useParams();
  let navigate = useNavigate();
  const { theatre_name, address, screenings } = props.data;
  function extractTime(dateTimeString) {
    // Create a Date object from the input string
    const date = new Date(dateTimeString);

    // Extract the hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine AM or PM suffix
    const amPm = hours >= 12 ? "PM" : "AM";

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight

    // Format minutes to ensure two digits
    const formattedMinutes = String(minutes).padStart(2, "0");

    // Return the formatted time string
    return `${hours}:${formattedMinutes}${amPm}`;
  }
  
  function handleClick(e, id) {
    e.preventDefault();
    navigate("/" + city + "/screening_seats/" + id);
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
            className="time"
            onClick={(e) => handleClick(e, obj.id)}
            key={obj.id}
          >
            {extractTime(obj.date_time)}
          </button>
        ))}
      </div>
    </div>
  );
}
export default EachScreening;
